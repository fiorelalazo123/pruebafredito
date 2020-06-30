import { Injectable, OnDestroy } from '@angular/core';
import { FormBuilder, ValidationErrors } from '@angular/forms';
import { RequiredControl, TextControl, JanusLoggerService, IClient, DocumentType } from '@janus/commons';
import { AditionalDataModel } from '@commons/models';
import { StepPresenter } from '@commons/helpers';
import { DateControl } from '@commons/form-controls';

@Injectable()
export class AditionalDataModalPresenter extends StepPresenter<AditionalDataModel> implements OnDestroy {

  /*
   *  ------------------------------------------------------- Miembros
   */

  public firstName: TextControl;
  public middleName: TextControl;
  public lastName: TextControl;
  public motherLastName: TextControl;
  public birthDate: DateControl;
  public gender: RequiredControl;
  public client: IClient;

  /*
   *  ---------------------------------------------------- Constructor
   */

  public constructor(private readonly fb: FormBuilder,
                     private readonly logger: JanusLoggerService) {

    super();

    this.createValidators();
    this.initForm();
  }

  /*
   *  ----------------------------------------------- Métodos Públicos
   */

  public ngOnDestroy() {

    this.logger.debug('destroy aditional data modal');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public setInitialValues(client: IClient): void {

    this.client = client;

    const model: AditionalDataModel = {
      firstName: this.client?.firstName,
      middleName: this.client?.middleName,
      lastName: this.client?.lastName,
      motherLastName: this.client?.motherLastName,
      birthDate: this.client?.birthDate,
      gender: this.client?.gender
    } as AditionalDataModel;

    this.patchValue(model);
  }

  /*
   *  ----------------------------------------------- Métodos Privados
   */

  private createValidators(): void {

    this.firstName = new TextControl(25, true, 2);
    this.middleName = new TextControl(25, false, 2);
    this.lastName = new TextControl(25, true, 2);
    this.motherLastName = new TextControl(25, false, 2);
    this.birthDate = new DateControl();
    this.gender = new RequiredControl('');

    this.motherLastName.setAsyncValidators(this.foreignMotherLastNameAsyncValidator());
  }

  private initForm(): void {

    this.form = this.fb.group({
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      motherLastName: this.motherLastName,
      birthDate: this.birthDate,
      gender: this.gender
    });
  }

  private foreignMotherLastNameAsyncValidator() {

    return () => {
      return new Promise((resolve) => {

        this.client.identityDocument.type === DocumentType.DNI ?
          resolve(!this.motherLastName.value ? ({ required: true } as ValidationErrors) : null) : resolve(null);

      });
    };
  }
}
