import { request, gql } from "graphql-request";
import { LocateVehiclesByZipResponse } from "./graphql/types";

const INVENTORY_QUERY = gql`
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


const result = await request<LocateVehiclesByZipResponse>(
  "https://api.search-inventory.toyota.com/graphql",
  INVENTORY_QUERY,
  {
    zipCode: "28270",
    brand: "TOYOTA",
    pageNo: 1,
    pageSize: 500,
    seriesCodes: 'tundrahybrid,tacoma,tacomahybrid',
    distance: 72,
  }
);

let tundras = 0;
let tacomas = 0;

for (const truck of result.locateVehiclesByZip.vehicleSummary) {

  // Skip any non-trd pros. Perform a toLowerCase just in case toyota in case
  if (!truck.model.marketingName.toLowerCase().includes("pro")) {
    continue;
  }
  console.log("-----------------------------------------------------")

  console.log(truck.year, truck.model.marketingName, "at", truck.dealerMarketingName)
  console.log("Exterior Color", truck.extColor.marketingName);
  console.log("Interior Color", truck.intColor.marketingName);
  console.log("Stock Number", truck.stockNum);
  if (truck.price.advertizedPrice && truck.price.totalMsrp) {
    console.log("Dealer Mark Up", truck.price.advertizedPrice - truck.price.totalMsrp)
  }
  console.log("Pre-Sold", truck.isPreSold);
  console.log("Hold Status", truck.holdStatus);
  console.log("VIN", truck.vin);
  console.log("Dealer Catagory", truck.dealerCategory, "(A=allocated F=freight G=ground)");
  console.log("Delivery", new Date(truck.eta.currFromDate).toLocaleString(), "to", new Date(truck.eta.currToDate).toLocaleString());
  console.log("Pricing", truck.price)
  console.log("Options", truck.options)

  if (truck.model.marketingName.includes("Tundra")) {
    tundras++;
  }
  if (truck.model.marketingName.includes("Tacoma")) {
    tacomas++;
  }
}
console.log("-----------------------------------------------------")
console.log("Tacomas:", tacomas, "Tundras:", tundras, "Total:", tacomas + tundras)
console.log("-----------------------------------------------------")
