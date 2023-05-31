export interface InventoryResponse {
  vehicleSummary: VehicleSummary[];
  pagination:     Pagination;
}

export interface Pagination {
  pageNo:       number;
  pageSize:     number;
  totalPages:   number;
  totalRecords: number;
}

export interface VehicleSummary {
  vin:             string;
  brand:           string;
  marketingSeries: string;
  year:            number;
  isTempVin:       boolean;
  dealerCd:        string;
  dealerCategory:  string;
  distributorCd:   string;
  eta:             Eta;
  model:           Model;
  mpg:             Mpg;
  engine:          Engine;
  bed:             Bed;
  cab:             Bed;
  transmission:    Transmission;
  drivetrain:      Bed;
  options:         Option[];
  holdStatus:      string;
  extColor:        TColor;
  intColor:        TColor;
  media:           Media[];
  price:           Price;
  disclaimer:      Disclaimer[];
  weightRating:    string;
  isPreSold:       boolean;
  offers:          any[];
}

export interface Bed {
  code:       string;
  title:      string;
  bulletlist: string;
}

export interface Disclaimer {
  disclaimerName: string;
  disclaimerType: string;
}

export interface Engine {
  engineCd: string;
  name:     string;
}

export interface Eta {
  currFromDate: Date;
  currToDate:   Date;
}

export interface TColor {
  colorCd:       string;
  marketingName: string;
  colorHexCd?:   string;
  colorFamilies: string[];
  colorSwatch?:  string;
}

export interface Media {
  type:      Type;
  href:      string;
  imageTag?: string;
  size?:     Size;
}

export enum Size {
  The1200_663_PNG = "1200_663_PNG",
  The380_214_PNG = "380_214_PNG",
  The680_383_PNG = "680_383_PNG",
  The864_477_PNG = "864_477_PNG",
}

export enum Type {
  Carjellyimage = "carjellyimage",
  Exterior = "exterior",
  Interior = "interior",
}

export interface Model {
  modelCd:        string;
  marketingName:  string;
  marketingTitle: string;
}

export interface Mpg {
  city:     number;
  highway:  number;
  combined: number;
}

export interface Option {
  optionCd:           string;
  marketingName?:     string;
  marketingLongName?: string;
  optionType:         OptionType;
  packageInd?:        boolean;
}

export enum OptionType {
  F = "F",
  L = "L",
}

export interface Price {
  baseMsrp:               number;
  totalMsrp:              number;
  advertizedPrice:        number;
  sellingPrice:           number;
  sellingPriceDiscounted: boolean;
  totalDealerInvoice:     number;
}

export interface Transmission {
  transmissionType: string;
}
