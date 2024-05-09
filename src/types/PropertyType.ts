import PropertyValueType from './PropertyValueType';

type PropertyType = {
  id: number;
  elementId: number;
  type: PropertyValueType;
  name: string;
  value: string;
};

export default PropertyType;
