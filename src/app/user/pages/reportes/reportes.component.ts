import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lote } from 'src/app/shared/interfaces/lote.interface';
import { Vaca } from 'src/app/shared/interfaces/vaca.interface';
import { UserService } from '../../user.service';
import { NombreLote_UsuarioId } from '../../../shared/interfaces/nombrelote-usuarioid.interface';
import { LoteArete } from 'src/app/shared/interfaces/lote-arete.interface';
import { Peso } from 'src/app/shared/interfaces/peso.interface';
import * as apex from 'ng-apexcharts';



@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  public lotes!: string[];
  public lote!: Lote;
  public loteId!: string;
  public vacas!: Vaca;
  public aretes!: string[];
  public arete!: string;
  public usuarioId!: string;
  public loteSelect!: NombreLote_UsuarioId;
  public areteSelect!: LoteArete;
  public vacaIds!: string[];
  public sumaDiasPeso!: Peso[];
  public diaPesoVaca!: Peso[];

  /* Banderas */
  public reporteLote: boolean = true;
  public reporteVaca: boolean = false;

  public tabla: boolean = true;
  public grafica: boolean = false;

  /* Variables de la grafica lote */
  public series: apex.ApexAxisChartSeries = [];
  public chart!: apex.ApexChart;
  public title!: apex.ApexTitleSubtitle;
  public responsive: apex.ApexResponsive[] = [];
  public dataLabels!: apex.ApexDataLabels;
  public markers!: apex.ApexMarkers;
  public grid!: apex.ApexGrid;
  public fill!: apex.ApexFill;

  /* Variables de la grafica lote */
  public seriesV: apex.ApexAxisChartSeries = [];
  public chartV!: apex.ApexChart;
  public titleV!: apex.ApexTitleSubtitle;
  public responsiveV: apex.ApexResponsive[] = [];


  /* formulario para hacer la peticion */
  formNombreLote: FormGroup = this.fb.group({
    nombreLote: ['', Validators.required]
  });

  /* formulario para hacer peticion del alimento */
  formVacaArete: FormGroup = this.fb.group({
    arete: ['', Validators.required]
  });


  constructor(private userService: UserService,
    private fb: FormBuilder) { }

  public ngOnInit(): void {

    //this.chartResponsive();
    /* Variable que contiene el ID del usuario */
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;
    /*Llamamos el metodo para el Get de los lotes */
    this.userService.getLoteByUsuarioId(this.usuarioId, 0, 0)
      /*mapeo de los nombres de los lotes */
      .subscribe(lotes => {
        /* */
        /* lotes contendra los nombres */
        this.lotes = lotes.map(lote => {
          return lote.nombreLote;
        });
      });

    /*Se evalua cuando cambia el contenido del selector*/
    this.formNombreLote.get('nombreLote')?.valueChanges
      .subscribe(nombreLote => {
        this.diaPesoVaca = undefined!;
        this.seriesV = [];
        /*Mandamos llamar seleccion lote para hacer la peticion del lorte */
        /*le mandamos la variable que contiene el id 
          y el valor que tiene el selector */
        this.formVacaArete.reset({
          arete: ''
        });

        this.seleccionLote(this.usuarioId, nombreLote);
      });

    /*  */
    this.formVacaArete.get('arete')?.valueChanges
      .subscribe(arete => {
        this.seleccionArete(this.loteId, arete);
      })
  }

  private initializeChartLote(series: Peso[]) {

    /* CONSEGUIMOS LOS */
    const DATA: { x: string, y: string }[] = [];
    series.forEach(fecha => {
      DATA.push({ x: fecha.dia!, y: fecha.kg?.toString()! })
    })

    this.title = {
      text: 'Peso del lote'
    };

    this.series = [{
      data: DATA
    }];

    this.chart = {
      height: 550,
      width: "100%",
      type: 'bar',

    }


    this.responsive = [{

      breakpoint: 1025,
      options: {
        chart: {
          height: 400,
          width: "100%",
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        legend: {
          position: "bottom"
        }
      }
    },
    {

      breakpoint: 390,
      options: {
        chart: {
          height: 300,
          width: "100%",
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        legend: {
          position: "bottom"
        }
      }
    }
    ];

    this.fill = {
      colors: ['#FDB51C']
    }

    this.dataLabels = {
      style: {
        colors: ['#000']
      }
    }

    this.markers = {
      colors: ['#FDB51C', '#000']
    }

    this.grid = {
      row:{
        colors: ['#fff']
      },
      column:{
        colors: ['#fff']
      }
    }


  }



  private initializeChartVaca(title: string, series: Peso[]) {
    this.titleV = {
      text: title
    };

    /* CONSEGUIMOS LOS */
    const DATA: { x: string, y: string }[] = [];
    series.forEach(fecha => {
      DATA.push({ x: fecha.dia!, y: fecha.kg?.toString()! })
    })

    this.seriesV = [{
      data: DATA
    }];


    this.chartV = {
      type: 'bar',
      height: 550,
      width: "100%",
    }

    this.responsiveV = [{
      breakpoint: 1025,
      options: {
        chart: {
          height: 400,
          width: "100%",
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        legend: {
          position: "bottom"
        }
      }
    },
    {

      breakpoint: 390,
      options: {
        chart: {
          height: 300,
          width: "100%",
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        legend: {
          position: "bottom"
        }
      }
    }
    ];


    this.fill = {
      colors: ['#FDB51C']
    }

    this.dataLabels = {
      style: {
        colors: ['#000']
      }
    }

    this.markers = {
      colors: ['#FDB51C', '#000']
    }

    this.grid = {
      row:{
        colors: ['#fff']
      },
      column:{
        colors: ['#fff']
      }
    }

  }


  /*Metodo para obtener a las vacas del lote */
  public seleccionLote(id: string, nombreLote: string) {
    /* Variable con interfaz para hacer peticion de un get con el ID del usuario 
       y con el nombre del lote */
    this.loteSelect = { id, nombreLote };
    /*Llamada al metodo que hara la peticion */
    this.userService.getLoteByUsuarioIdAndNombreLote(this.loteSelect)
      .subscribe(async lote => {
        this.sumaDiasPeso = [];
        /* Le pasa el id del lote */
        this.loteId = lote.id!;
        /* */
        this.lote = lote;
        /* Mapeo de los aretes */
        this.aretes = lote.vacas?.map(vaca => {
          return vaca.arete;
        })!;
        /* Mapeo de los id de las vacas */
        this.vacaIds = lote.vacas?.map(vaca => {
          return vaca.id!;
        })!;

        const FECHASVACAS = [];
        for (let i = 0; i < this.vacaIds.length; i++) {
          const PESO = await this.getPeso(this.vacaIds[i]);
          FECHASVACAS.push(PESO)
        }

        let mayor = 0;
        /* conseguimos el lenght mas grande del arreglo */
        FECHASVACAS.forEach((fecha) => {
          if (fecha.length >= mayor) {
            mayor = fecha.length;
          }
        });

        let SUMAFECHAS: Peso[] = [];

        FECHASVACAS.forEach((fecha, index) => {
          fecha.forEach(fecha => {
            let add = false;
            SUMAFECHAS.forEach(value => {
              if (value.dia) {
                if (value.dia === fecha.dia) {
                  value.kg = value.kg! + fecha.kg!;
                  value.lb = value.lb! + fecha.lb!;
                  add = true
                }
              }
            })
            if (!add) {
              SUMAFECHAS.push({ dia: fecha.dia, kg: fecha.kg, lb: fecha.lb })
            }
          })


        });

        console.log(SUMAFECHAS);


        this.sumaDiasPeso = SUMAFECHAS.sort((a, b) => (a.dia! > b.dia!) ? 1 : -1);
        /* Inicializamos el chart */
        this.initializeChartLote(SUMAFECHAS);
        //this.chartResponsive(SUMAFECHAS);

        console.log(lote, 'aretes', this.aretes);
        console.log('ids', this.vacaIds);
      },
        error => {
          this.sumaDiasPeso = undefined!;
          this.diaPesoVaca = undefined!;
          this.aretes = undefined!;
        })
  }

  /* Metodo para obtener datos de la vaca */

  public seleccionArete(id: string, arete: string) {
    this.areteSelect = { id, arete };
    console.log(this.areteSelect);
    this.arete = arete;
    this.userService.getVacaByLoteIdAndArete(this.areteSelect)
      .subscribe(vaca => {
        console.log('Vaca seleccionada', vaca);
        this.getPesoVaca(vaca.id!);
      },
        error => {
          this.diaPesoVaca = undefined!;
          this.seriesV = [];
        })
  }

  public getPesoVaca(vacaId: string) {
    this.userService.getPesoByVacaId(vacaId)
      .subscribe(peso => {
        peso = peso.sort((a, b) => (a.dia! > b.dia!) ? 1 : -1);
        this.diaPesoVaca = peso;
        this.initializeChartVaca('Vaca: ' + this.arete, peso);
      })
  }

  public async getPeso(vacaId: string): Promise<Peso[]> {
    return new Promise((resolve, reject) => {
      this.userService.getPesoByVacaId(vacaId)
        .subscribe({
          next: peso => {
            resolve(peso);
          },
          error: () => { reject([]) }
        })
    })
  }

  public changeReporte() {
    if (this.reporteLote) {
      this.reporteLote = false;
      this.reporteVaca = true;
    } else {
      this.reporteLote = true;
      this.reporteVaca = false;
    }
  }

  public changeTablaGrafica() {
    if (this.tabla) {
      this.tabla = false;
      this.grafica = true;
    } else {
      this.tabla = true;
      this.grafica = false;
    }
  }

}
