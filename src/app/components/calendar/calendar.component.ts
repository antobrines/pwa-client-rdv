import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EventSettingsModel,
  CellClickEventArgs,
  ScheduleComponent,
  PopupOpenEventArgs,
  ActionEventArgs,
  RenderCellEventArgs,
} from '@syncfusion/ej2-angular-schedule';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { Internationalization } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  eventSettings: EventSettingsModel = {
    allowDeleting: false,
    allowEditing: false,
    minimumEventDuration: 60,
  };
  @ViewChild('scheduleObj') scheduleObj!: ScheduleComponent;
  @ViewChild('eventTypeObj')
  eventTypeObj!: DropDownListComponent;
  @ViewChild('titleObj')
  titleObj!: TextBoxComponent;
  @ViewChild('notesObj')
  notesObj!: TextBoxComponent;
  today = new Date();
  tomorrow = new Date(this.today);
  daysWork = [1, 2, 3, 4, 5];
  fakeDisponibilities = [
    {
      date: new Date(),
      appointments: [
        {
          id: 1,
          category: 0,
          userUid: 'userUid',
          start: '09:00',
          duration: 60,
        },
      ],
    },
  ];
  disponibilities: any[] = [];
  clickCount = 1;
  constructor() {
    this.tomorrow.setDate(this.today.getDate() + 1);
    this.fakeDisponibilities[0].date = this.tomorrow;
  }

  ngOnInit(): void {}

  public selectedDate: Date = new Date();
  public intl: Internationalization = new Internationalization();
  public categoriesFields: Object = { text: 'name', value: 'id' };
  public categories: Object[] = [
    {
      name: "Soins d'hygiène, nursing",
      id: 0,
    },
    {
      name: "Aide à l'habillage, pose et retrait des bas de contention",
      id: 1,
    },
    {
      name: 'Injections intraveineuses, sous-cutanées, intramusculaires',
      id: 2,
    },
    {
      name: 'Prélèvements sanguins, urinaires, bactériologiques, cytologiques',
      id: 3,
    },
    {
      name: 'Surveillance des paramètres vitaux',
      id: 4,
    },
    {
      name: 'Administration des thérapeutiques',
      id: 5,
    },
    {
      name: 'Réfection des piluliers, gestion des stocks thérapeutiques',
      id: 6,
    },
    {
      name: 'Pansements simples, complexes, chirurgicaux, infectés, ulcéreux',
      id: 7,
    },
    {
      name: 'Soins sur chambre implantable',
      id: 8,
    },
    {
      name: 'Soins palliatifs',
      id: 9,
    },
    {
      name: 'Accréditation chimiothérapie',
      id: 10,
    },
    {
      name: 'Soins et surveillance des personnes diabétiques',
      id: 11,
    },
    {
      name: 'Alimentation entérale et parentérale',
      id: 12,
    },
    {
      name: 'Perfusions, antibiothérapie',
      id: 13,
    },
    {
      name: 'Prévention et soins d’escarres',
      id: 14,
    },
    {
      name: 'Soins post-chirurgie',
      id: 15,
    },
    {
      name: 'Ablation de fils, agrafes et dispositifs chirurgicaux',
      id: 16,
    },
  ];

  buttonClickActions(e: Event) {
    const date = this.selectedDate;
    const categorySelected = this.eventTypeObj.value;
  }

  onCreated() {
    // TODO Fetch to disponibilities for the current month (make it as function that take, month, year and day)
  }

  onCellClick(args: CellClickEventArgs) {
    if (args.element) {
      const element = args.element as HTMLElement;
      if (
        element?.classList.contains('e-disable-dates') ||
        !element?.classList.contains('e-work-days')
      ) {
        this.clickCount = 0;
      }
    }
    this.clickCount++;
    if (this.clickCount === 1) {
      this.clickCount = 1;
      args.cancel = true;
    } else if (this.clickCount === 2) {
      // * Show the basic editor
      args.cancel = false;
      this.clickCount = 1;
      this.disponibilities = this.fakeDisponibilities.filter(
        (dispo) => dispo.date.toDateString() === args.startTime.toDateString()
      );
      const startHours =  '09:00';
      const endHours = '18:00';
      const durationOfEvent = 60;
      // TODO Later
    }
  }

  // * Disable the basic editor
  onPopupOpen(args: PopupOpenEventArgs) {
    if (args.type == 'Editor') {
      args.cancel = true;
    }
  }

  onActionBegin(args: ActionEventArgs) {
    if (
      args.requestType === 'eventCreate' ||
      args.requestType === 'eventChange' ||
      args.requestType === 'eventRemove'
    ) {
      // check if is really ready
    }
  }

  // add scss on the past days
  onRenderCell(args: RenderCellEventArgs): void {
    if (args.date) {
      if (args.date < new Date()) {
        args.element.classList.add('e-disable-dates');
      }
    }
  }
}
