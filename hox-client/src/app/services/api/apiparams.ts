import { HttpParams }  from '@angular/common/http';

export class ApiParams {
  $idField: string;
  $sort: string;
  $sortOrder: string;
  $limit: number;
  $populate: Object|Array<string>|string;
  queryParams: Object = {};

  constructor(json) {
    for(let field in json) {
      if(field.startsWith('$')) {
        // Is query option
        this[field] = json[field];
      } else {
        this.queryParams[field] = json[field];
      }
    }
  }

  toHttpParams(): HttpParams {
    const params: any = {};

    if (this.$idField) params['$idField'] = this.$idField;
    if (this.$sort) params['$sort'] = this.$sort;
    if (this.$sortOrder) params['$sortOrder'] = this.$sortOrder;
    if (this.$limit) params['$limit'] = this.$limit.toString();
    if (this.$populate) {
      if (typeof(this.$populate) === "string") {
        params['$populate'] = this.$populate;
      } else {
        params['$populate'] = JSON.stringify(this.$populate);
      }
    }

    for(let key in this.queryParams) {
      params[key] = this.queryParams[key];
    }

    return new HttpParams({
      fromObject: params
    });
  }
}
