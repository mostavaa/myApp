import { HttpService } from "./http.service";
import { Injectable } from "@angular/core";
import { Constants } from "./constants";
@Injectable()
export class CRUDService {
    controller: string;
    constructor(private httpService: HttpService) {

    }
    getAll(query?) {
        return this.httpService.invoke({
            method: 'GET',
            url: Constants.SiteUrl,
            path: this.controller,
            query:query
        })
    }
    add(node: any) {
        return this.httpService.invoke({
            method: 'POST',
            url: Constants.SiteUrl,
            path: this.controller+'/add',
            body: node
        })
    }

    delete(guid) {
        return this.httpService.invoke({
            method: 'PUT',
            url: Constants.SiteUrl,
            path: this.controller+'/delete',
            body: { id: guid }
        })
    }

    edit(node): any {
        return this.httpService.invoke({
            method: 'POST',
            url: Constants.SiteUrl,
            path: this.controller+'/update',
            body: node,
        })
    }

}