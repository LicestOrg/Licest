import PropertyType from './PropertyType';

type ElementType = {
  id: number;
  pageId: string;
  name: string;
  properties: PropertyType[];
  createdAt: string;
  updatedAt: string;
};

export default ElementType;
