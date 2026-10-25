// Editorial schema for future verified projects. Do not add invented completed buildings.
export type Realization = {
  slug: string;
  title: string;
  description: string;
  location: string;
  year: number;
  images: { src: string; alt: string }[];
  ownerApproved: boolean;
};
export const realizations: Realization[] = [];
