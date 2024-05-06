import PropertyType from './PropertyType';

type ElementType = {
  id: number;
  pageId: string;
  name: string;
  properties: [
    {
      id: number;
      elementId: number;
      type: PropertyType;
      name: string;
      value: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
};

export default ElementType;
