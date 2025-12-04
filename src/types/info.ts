import { Gemschigrad } from './player';

export interface TenueItem {
  id: string;
  text: string;
  order: number;
}

export type TenueData = {
  [K in Gemschigrad]: TenueItem[];
}

export interface Pendenz {
  id: string;
  title: string;
  done: boolean;
}

