class DataClass {
  constructor({name, collectionName, attributes}) {
    this.name = name;
    this.collectionName = collectionName;
    this.attributes = attributes;
  }
}

class Attribute {
  constructor({name, type, readOnly}) {
    this.name = name;
    this.type = type;
    this.readOnly = readOnly === true;
  }
}

class AttributeRelated extends Attribute {

}

class AttributeCollection extends Attribute {
  constructor({name, type, readOnly}) {
    super({name, type, readOnly});
    this.entityType = type.substring(0, type.length - 10);
  }
}

export {DataClass, Attribute, AttributeRelated, AttributeCollection};
