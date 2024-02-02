import { firefox } from 'playwright';
import { request, gql } from "graphql-request";
import { LocateVehiclesByZipResponse, VehicleSummary } from './types';
import { writeFile } from 'fs/promises';
import { getRandom } from 'random-useragent';

async function getHeaders() {
  const browser = await firefox.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    userAgent: getRandom(),
  });

  let headers;

  page.on('request', async (request) => {
    const url = request.url();
    if (url.endsWith("/graphql")) {
      headers = request.headers();
    }
  });

  await page.goto('https://www.toyota.com/search-inventory/model/tacoma/?zipcode=28270');

  await page.waitForLoadState("networkidle");

  await browser.close();

  return headers;
}


const INVENTORY_QUERY = gql`
  query LocateVehiclesByZip($zipCode: String, $brand: String, $pageNo: Int, $pageSize: Int, $seriesCodes: String, $distance: Int, $year: Int) {
    locateVehiclesByZip(zipCode: $zipCode, brand: $brand, pageNo: $pageNo, pageSize: $pageSize, seriesCodes: $seriesCodes, distance: $distance, year: $year) {
      pagination {
        pageNo
        pageSize
        totalPages
        totalRecords
      }
      vehicleSummary {
        vin
        stockNum
        brand
        marketingSeries
        year
        isTempVin
        dealerCd
        dealerCategory
        distributorCd
        holdStatus
        weightRating
        isPreSold
        dealerMarketingName
        dealerWebsite
        isSmartPath
        distance
        isUnlockPriceDealer
        transmission {
          transmissionType
        }
        price {
          advertizedPrice
          totalMsrp
          sellingPrice
          baseMsrp
        }
        options {
          optionCd
          marketingName
          marketingLongName
          optionType
          packageInd
        }
        mpg {
          city
          highway
          combined
        }
        model {
          modelCd
          marketingName
          marketingTitle
        }
        media {
          type
          href
          imageTag
          source
        }
        intColor {
          colorCd
          colorSwatch
          marketingName
          nvsName
          colorFamilies
        }
        extColor {
          colorCd
          colorSwatch
          marketingName
          colorHexCd
          nvsName
          colorFamilies
        }
        eta {
          currFromDate
          currToDate
        }
        engine {
          engineCd
          name
        }
        drivetrain {
          code
          title
          bulletlist
        }
        family
        cab {
          code
          title
          bulletlist
        }
        bed {
          code
          title
          bulletlist
        }
      }
    }
  }
`;

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const zipCodes = ["28270", "75201", "90274", "32198", "10003"];

async function run() {
  let headers = await getHeaders();

  let failures = 0;

  let vehicles: (VehicleSummary & { nearMe: boolean })[] = [];

  for (const zipCode of zipCodes) {
    let page = 1;
    let pages = 1;

    let result = null;

    do {
      console.log(`Zip Code ${zipCode} | Page ${page}/${pages}`);
      try {
        result = await request<LocateVehiclesByZipResponse>(
          "https://api.search-inventory.toyota.com/graphql",
          INVENTORY_QUERY,
          {
            zipCode: zipCode,
            brand: "TOYOTA",
            pageNo: page,
            pageSize: 100,
            seriesCodes: 'tacoma,tacomahybrid',
            distance: 2000,
            year: 2024,
          },
          headers 
        );
      } catch (error) {
        console.error("Got request error", error)
        failures++;
        
        if (failures > 5) {
          process.exit();
        }
        headers = await getHeaders();
        continue;
      }

      if (!result?.locateVehiclesByZip) {
        break;
      }

      vehicles = vehicles.concat(result.locateVehiclesByZip.vehicleSummary.map(truck => ({
        ...truck,
        nearMe: zipCode === "28270" && truck.distance <= 500
      })));

      pages = result.locateVehiclesByZip.pagination.totalPages;
      page++;

      await sleep(5_000);
    } while (page <= pages)
  }

  const data = vehicles.map((v) => {
    return ({
      VIN: v.vin,
      "Stock Number": v.stockNum,
      Year: v.year,
      Trim: v.model.marketingName,
      Description: v.model.marketingTitle,
      Series: v.marketingSeries,
      "Shipping Status": getShippingStatus(v.dealerCategory),
      'Pre-Sold': v.isPreSold,
      'Hold Status': v.holdStatus,
      'Temp VIN': v.isTempVin,
      'Dealer': v.dealerMarketingName,
      'Base MSRP': v.price.baseMsrp,
      'Total MSRP': v.price.totalMsrp,
      'Advertized Price': v.price.advertizedPrice,
      'Mark Up': (v.price.advertizedPrice && v.price.totalMsrp) ? (v.price.advertizedPrice - v.price.totalMsrp) : 0,
      "Exterior Color": v.extColor.marketingName,
      "Interior Color": v.intColor.marketingName,
      "Delivery ETA From": v.eta?.currFromDate ?? null,
      "Delivery ETA To": v.eta?.currToDate ?? null,
      "Near Me": v.nearMe,
    })});

  const filteredData = data.reduce<typeof data>((acc, truck) => {
    if (truck.Year >= 2024 && !acc.some(t => t.VIN === truck.VIN)) {
      acc.push(truck);
    }
    return acc;
  }, []);

  await writeFile("data.json", JSON.stringify(filteredData, null, 2));
}

run();


function getShippingStatus(dealerCategory: string) {
  const category = dealerCategory.toLowerCase();

  switch (category) {
    case 'g':
      return "At dealer (G)"
    case 'f':
      return "In transit (F)"
    case 'a':
      return "Allocated (A)"
    default:
      return dealerCategory;
  }
}
