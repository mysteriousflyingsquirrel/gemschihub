import { Gemschigrad } from './player';

export interface TenueItem {
  id: string;
  text: string;
  order: number;
}

export type TenueData = {
  [K in Gemschigrad]: TenueItem[];
}
