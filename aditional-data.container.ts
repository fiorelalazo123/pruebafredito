import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { IClient, Parameter, JanusStateService, JanusMessageBusService, JanusLoggerService } from '@janus/commons';
import { AditionalDataModel } from '@commons/models';

@Component({
  selector: 'mortg-aditional-data-modal',
  templateUrl: './aditional-data.container.html'
})
export class AditionalDataModalContainer implements OnInit {

  public client: IClient;
  public genders: Array<Parameter>;
  public isLoading: boolean;
  public maxClientAge: Parameter;
  public minClientAge: Parameter;

  @Output() public readonly closed: EventEmitter<void>;

  public constructor(private readonly janusStateService: JanusStateService,
                     private readonly logger: JanusLoggerService,
                     private readonly messageBus: JanusMessageBusService) {

    this.closed = new EventEmitter();
    this.isLoading = false;
  }

  public ngOnInit(): void {

    this.logger.debug('aditiona-data-modal init');
    this.initParameters();
    this.client = this.janusStateService.get<IClient>('client');
  }

  public saveClient(model: AditionalDataModel) {

    this.client.firstName = model.firstName;
    this.client.lastName = model.lastName;
    this.client.middleName = model.middleName;
    this.client.motherLastName = model.motherLastName;
    this.client.birthDate = model.birthDate;
    this.client.gender = model.gender;

    this.validateMVP();

    this.closed.next();
    this.closed.complete();
  }

  private initParameters() {

    this.genders = [
      new Parameter('MASCULINO', 'Masculino'),
      new Parameter('FEMENINO', 'Femenino')
    ];

    this.maxClientAge = new Parameter('70', '70');
    this.minClientAge = new Parameter('25', '25');
  }

  private validateMVP() {

    const dayjs = require('dayjs');
    const now = dayjs();

    const minYear = now.subtract(this.minClientAge.Name, 'year').format('YYYY-MM-DD');
    const maxYear = now.subtract(this.maxClientAge.Name, 'year').format('YYYY-MM-DD');
    const birthDate = this.client.birthDate.split('/');

    const diffMinDate = dayjs(minYear).diff(dayjs(`${birthDate[2]}-${birthDate[1]}-${birthDate[0]}`), 'days', true);
    const diffMaxDate = dayjs(maxYear).diff(dayjs(`${birthDate[2]}-${birthDate[1]}-${birthDate[0]}`), 'days', true);

    if (diffMinDate < 0 || diffMaxDate > 0) {

      this.messageBus.publishTopicInChannel('janus', 'navigate.info', true);
    } else {
      this.janusStateService.set('client', this.client);
    }
  }
}
