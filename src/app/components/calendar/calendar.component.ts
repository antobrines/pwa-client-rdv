import { MeetService } from './../../services/meet.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  EventSettingsModel,
  CellClickEventArgs,
  ScheduleComponent,
  RenderCellEventArgs,
} from '@syncfusion/ej2-angular-schedule';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { StateService } from 'src/app/services/state.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  @ViewChild('categoryObj') categoryObj!: DropDownListComponent;
  @ViewChild('hourObj')
  hourObj!: DropDownListComponent;
  presta: any;
  selectedHour: any;
  selectedCategory: any;

  hour: any;
  private _startDate = new BehaviorSubject<any>(null);
  public startDate$ = this._startDate.asObservable();
  today = new Date();
  showQuickInfo = false;
  tomorrow = new Date(this.today);
  workDays = [1, 2, 3, 4, 5];
  prestaMeets: any = [];
  disponibilities: any[] = [];

  constructor(
    private stateService: StateService,
    private meetService: MeetService,
    private router: Router,
    private http: HttpClient
  ) {
    this.tomorrow.setDate(this.today.getDate() + 1);
  }

  ngOnInit(): void {
    this.stateService.prestaSelected$.subscribe((presta) => {
      this.presta = presta;
    });
    this.startDate$.subscribe((date) => {
      console.log(date);
    });
  }

  ngOnChanges(): void {
    this.meetService
      .getMeetsUserDate(this.presta, this.selectedDate)
      .subscribe((meets) => {
        this.prestaMeets = meets;
        console.log();
      });
  }

  // add on change event on this.selectedDate

  public selectedDate: Date = new Date();
  public categories: any[] = [
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

  onCellClick(args: CellClickEventArgs) {
    args.cancel = this.isValidAction(args.startTime);
    if (args.cancel) {
      return;
    }
    const element = args.element as HTMLElement;
    args.cancel = !element.classList.contains('e-work-days');
    this._startDate.next(args.startTime.getTime());
    console.log({
      uid: this.presta,
      data: this._startDate.value,
    });
    this.meetService
      .getMeetsUserDate(this.presta, this._startDate.value)
      .subscribe((meets) => {
        console.log(meets);
        this.disponibilities = [];
        for (let i = 9; i < 18; i++) {
          const hour = i < 10 ? `0${i}:00` : `${i}:00`;
          const hourDispo = meets.find((dispo: any) => {
            return dispo.hour === hour;
          });
          if (!hourDispo) {
            if (i === 12 || i === 13) {
              continue;
            }
            this.disponibilities.push({
              hour,
              duration: 60,
            });
          }
        }
      });
  }

  onPopupOpen(args: any) {
    return;
  }

  onRenderCell(args: RenderCellEventArgs): void {
    if (args.date) {
      if (args.date < new Date()) {
        args.element.classList.add('e-disable-dates');
      }
    }
  }

  isValidAction(date: Date) {
    if (!(date.getTime() > this.today.getTime())) {
      return true;
    }
    return false;
  }

  async onBeforeAction(args: any) {
    if (args.requestType === 'eventCreate') {
      const description = args.data[0].description;
      const prestaUid = this.presta.uid;
      const date = this._startDate.value;
      // const catagoryUid = this.selectedCategory;
      const hour = this.selectedHour;
      const data = {
        description,
        prestaUid,
        date,
        hour,
      };
      await this.meetService.createMeet(data);
      this.meetService.sendMessage(prestaUid);
      // const headers = new HttpHeaders({
      //   'Content-Type': 'application/json',
      //   Authorization:
      //     'key=AAAAVebqlUY:APA91bHPy6JABJ7TaLFMpIDJ28n6LdIRE5L3jLJD2HdlNqBBhGiI7D6s_hCHznQAdfbPL9IQ7LJoYiMzRdPUn5iL6bA8xCpv0ET8vVoHz6LmichFiWkx_VzLU_7ygR5xTGMwgHg-Iw_3',
      // });
      // this.http
      //   .post(
      //     'https://fcm.googleapis.com/fcm/send',
      //     {
      //       to: 'dAwJGmApq77LelKX1HXwAY:APA91bGSDi5FAYldHjUgz210sg6kZ-tPh9mf5l-ZwTGRp8xtV66dIDPxNNUgU-OoFFn0cr79wuzkFCEJBsOCnGsf7kb4Zx-RXNQEiHn6COk-aCBEJwo1AhaUPaPOUrfNb7DuZsQVhtDq',
      //       notification: {
      //         title: 'Nouvelle demande de rendez-vous',
      //         body: 'Vous avez une nouvelle demande de rendez-vous',
      //       },
      //     },
      //     { headers }
      //   )
      //   .subscribe((res) => {
      //     console.log(res);
      //   });
      // this.router.navigate(['/dashboard']);
    }
  }
}
