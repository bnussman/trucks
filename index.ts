import { InventoryResponse, Price } from "./types";

const dealers = [ 
  { id: 32096, name: "Scott Clark Toyota" },
  { id: 32126, name: "Town and Country Toyota" },
  { id: 39058, name: "Toyota of Rock Hill" },
  { id: 32106, name: "Hendrick Toyota Concord" },
  { id: 32137, name: "Toyota of North Charlotte" },
  { id: 32139, name: "Toyota of Gastonia" }
];

const zipCode = 28270;

for (const { id, name } of dealers) {
  const response = await fetch(`https://mobile-api.rti.toyota.com/retail/inventory?dealer[]=${id}&zipCode=${zipCode}&region=50&pageNo=1&pageSize=50&includeInvPooling=true&brand=T&type=new&seriesCodes[]=tundrahybrid&model[]=8424&sort[]=dealerCategory%20desc,price.sellingPrice%20asc,vin%20desc`, {
    headers: {
      "Referer": "https://smartpath.toyota.com/",
    },
  });

  const data = await response.json<InventoryResponse>();

  if (!data.vehicleSummary) {
    console.log(`Error at ${name}, no data!`);
    continue;
  }


  console.log("-----------------------------------------------------")
  for (const truck of data.vehicleSummary) {
    console.log(truck.extColor.marketingName, truck.model.marketingName, "at", name)
    for (const key of Object.keys(truck.price)) {
      console.log(key, `$${truck.price[key as keyof Price].toLocaleString()}`);
    }
    console.log("Pre-Sold", truck.isPreSold);
    console.log("Hold Status", truck.holdStatus);
    console.log("VIN", truck.vin);
    console.log("Dealer Catagory", truck.dealerCategory, "(A=allocated F=freight G=ground)");
    console.log("Delivery", truck.eta);
  }
}