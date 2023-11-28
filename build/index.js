"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playwright_1 = require("playwright");
const graphql_request_1 = require("graphql-request");
const promises_1 = require("fs/promises");
async function getHeaders() {
    const browser = await playwright_1.firefox.launch();
    const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 }
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
const INVENTORY_QUERY = (0, graphql_request_1.gql) `
  query LocateVehiclesByZip($zipCode: String, $brand: String, $pageNo: Int, $pageSize: Int, $seriesCodes: String, $distance: Int) {
    locateVehiclesByZip(zipCode: $zipCode, brand: $brand, pageNo: $pageNo, pageSize: $pageSize, seriesCodes: $seriesCodes, distance: $distance) {
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
          nonSpAdvertizedPrice
          totalMsrp
          sellingPrice
          dph
          dioTotalMsrp
          dioTotalDealerSellingPrice
          dealerCashApplied
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function run() {
    const headers = await getHeaders();
    console.log("Got headers", headers);
    let page = 1;
    let pages = 1;
    let vehicles = [];
    do {
        console.log(`Page ${page}/${pages}`);
        const result = await (0, graphql_request_1.request)("https://api.search-inventory.toyota.com/graphql", INVENTORY_QUERY, {
            zipCode: "28270",
            brand: "TOYOTA",
            pageNo: page,
            pageSize: 25,
            seriesCodes: 'tundrahybrid,tacoma,tacomahybrid',
            distance: 50,
        }, headers);
        vehicles = vehicles.concat(result.locateVehiclesByZip.vehicleSummary);
        pages = result.locateVehiclesByZip.pagination.totalPages;
        page++;
        await sleep(5000);
    } while (page <= pages);
    console.table(vehicles);
    await (0, promises_1.writeFile)("data.json", JSON.stringify(vehicles, null, 2));
}
run();
