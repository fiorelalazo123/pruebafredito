import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { IClient, Parameter } from '@janus/commons';
import { AditionalDataModalPresenter } from './aditional-data.presenter';
import { AditionalDataModel } from '@commons/models';

@Component({
  selector: 'mortg-aditional-data-modal-component-ui',
  templateUrl: './aditional-data.component.html',
  styleUrls: [ './aditional-data.component.scss' ],
  providers: [
    AditionalDataModalPresenter
  ]
})
export class AditionalDataModalComponent implements OnInit {

  @Input() public client: IClient;
  @Input() public isLoading: boolean;
  @Input() public genders: Array<Parameter>;

  @Output() public readonly closed: EventEmitter<void>;
  @Output() public readonly saveClient: EventEmitter<AditionalDataModel>;

  public constructor(public readonly aditionalDataPresenter: AditionalDataModalPresenter) {

    this.closed = new EventEmitter();
    this.saveClient = new EventEmitter();
  }

  public ngOnInit(): void {

    this.setInitialValues();
  }

  public saveData(): void {

    if (this.aditionalDataPresenter.Valid) {

      this.saveClient.next(this.aditionalDataPresenter.Value);
    }
  }

  private setInitialValues(): void {

    this.aditionalDataPresenter.setInitialValues(this.client);
  }
}
