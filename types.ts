export interface LocateVehiclesByZipResponse {
  locateVehiclesByZip: LocateVehiclesByZip;
}

export interface LocateVehiclesByZipVariables {
  zipCode: String;
  brand: String;
  pageNo: Number;
  pageSize: Number;
  seriesCodes: String;
  distance: Number;
}

export interface LocateVehiclesByZip {
  pagination:     Pagination;
  vehicleSummary: VehicleSummary[];
}

export interface Pagination {
  pageNo:       number;
  pageSize:     number;
  totalPages:   number;
  totalRecords: number;
}

export interface VehicleSummary {
  vin:                 string;
  stockNum:            null | string;
  brand:               string;
  marketingSeries:     string;
  year:                number;
  isTempVin:           boolean;
  dealerCd:            string;
  dealerCategory:      string;
  distributorCd:       string;
  holdStatus:          string;
  weightRating:        string;
  isPreSold:           boolean;
  dealerMarketingName: string;
  dealerWebsite:       string;
  isSmartPath:         boolean;
  distance:            number;
  isUnlockPriceDealer: boolean;
  transmission:        Transmission;
  price:               { [key: string]: number | null };
  options:             Option[];
  mpg:                 Mpg;
  model:               Model;
  media:               Media[];
  intColor:            TColor;
  extColor:            TColor;
  eta:                 Eta;
  engine:              Engine;
  drivetrain:          Bed;
  family:              null;
  cab:                 Bed;
  bed:                 Bed;
}

export interface Bed {
  code:       Code;
  title:      Title;
  bulletlist: string;
}

export enum Code {
  Crewmax = "crewmax",
  Shortbed = "shortbed",
  The4X2 = "4x2",
  The4X4 = "4x4",
}

export enum Title {
  CrewMax = "CrewMax",
  The4X2 = "4x2",
  The4X4 = "4x4",
  The55Ft = "5.5ft",
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
  colorSwatch:   null | string;
  marketingName: string;
  colorHexCd?:   string;
  nvsName:       null;
  colorFamilies: string[];
}

export interface Media {
  type:     Type;
  href:     string;
  imageTag: ImageTag | null;
  source:   null;
}

export enum ImageTag {
  Buck = "Buck",
  DSFront34 = "DS front 3/4",
  DSFront78 = "DS front 7/8",
  DSProfile = "DS profile",
  DSRear34 = "DS rear 3/4",
  FrontSeatProfile = "Front seat profile",
  IPDash = "IP/dash",
  RearSeatProfile = "Rear seat profile",
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
  optionCd:          string;
  marketingName:     null | string;
  marketingLongName: null | string;
  optionType:        OptionType;
  packageInd:        boolean | null;
}

export enum OptionType {
  F = "F",
  L = "L",
}

export interface Transmission {
  transmissionType: string;
}
