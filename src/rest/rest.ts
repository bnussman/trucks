import { InventoryResponse, Price } from "./types";

const dealers = [ 
  { id: 32096, name: "Scott Clark Toyota" },
  { id: 32126, name: "Town and Country Toyota" },
  { id: 39058, name: "Toyota of Rock Hill" },
  { id: 32106, name: "Hendrick Toyota Concord" },
  { id: 32137, name: "Toyota of North Charlotte" },
  { id: 32139, name: "Toyota of Gastonia" },
  { id: 39061, name: "Toyota of Greenville" },
  { id: 39051, name: "Toyota of Greer" },
  { id: 39028, name: "Toyota of Easley" },
  { id: 39068, name: "Spartenberg Toyota" },
  { id: 32141, name: "Modern Toyota of Boone"},
  { id: 32148, name: "Fred Anderson Toyota of Asheville"},
  { id: 32113, name: "Bryan Easler Toyota" },
  { id: 39056, name: "Scott Will Toyota of Sumter" },
  { id: 39066, name: "Peter Boulware Toyota of Columbia" },
  { id: 39067, name: "Midlands Toyota" },
  { id: 39049, name: "Lugoff Toyota" },
  { id: 32111, name: "Modern Toyota Winston-Salem" },
  { id: 32082, name: "Vann York Toyota" },
  { id: 32154, name: "Mark Jacobson Toyota" },
  { id: 32142, name: "Hendrick Toyota Apex" },
  { id: 32097, name: "Fred Anderson Toyota" },
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
    console.log(`No trucks at ${name}!`);
    continue;
  }


  console.log("-----------------------------------------------------")
  for (const truck of data.vehicleSummary) {
    console.log(truck.extColor.marketingName, truck.model.marketingName, "at", name)
    for (const key of Object.keys(truck.price)) {
      console.log(key, `$${truck.price[key as keyof Price].toLocaleString()}`);
    }
    console.log("Dealer Mark Up", truck.price.advertizedPrice - truck.price.totalMsrp)
    console.log("Pre-Sold", truck.isPreSold);
    console.log("Hold Status", truck.holdStatus);
    console.log("VIN", truck.vin);
    console.log("Dealer Catagory", truck.dealerCategory, "(A=allocated F=freight G=ground)");
    console.log("Delivery", truck.eta);
    console.log("-----------------------------------------------------")
  }
}