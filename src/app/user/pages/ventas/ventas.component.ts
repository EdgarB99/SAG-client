import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { Vaca } from 'src/app/shared/interfaces/vaca.interface';
import { NombreLote_UsuarioId } from 'src/app/shared/interfaces/nombrelote-usuarioid.interface';
import { Router } from '@angular/router';
import { Peso } from 'src/app/shared/interfaces/peso.interface';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  public usuarioId!: string;
  public vacas: Vaca[] = [];
  public vacasV: Vaca[] = [];
  public vaca!: Vaca;
  public lotes!: string[];
  public loteId!: string;
  public actualizar: boolean = false;
  public pagination: number = 0;
  public vacasVendidas!: Vaca[];
  public ventas: boolean = true;
  public vendidas: boolean = false;
  public pesos!: Peso[];

  /* formulario para hacer la peticion */
  formNombreLote: FormGroup = this.fb.group({
    nombreLote: ['', Validators.required],
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.userService.decodeUsuarioFromToken()!;

    this.userService
      .getLoteByUsuarioId(this.usuarioId, 0, 0)
      .subscribe((lotes) => {
        this.lotes = lotes.map((lote) => {
          return lote.nombreLote;
        });

        /* Get vacas listas para venta */
        const VACASLISTAS: Vaca[][] = [];
        lotes.forEach(async (lote) => {
          const VACA = await this.getVacas(lote.id!);
          VACA.forEach(async (vaca) => {
            const PESOS = await this.getLastPeso(vaca.peso!);
            console.log(PESOS);

            if (PESOS.kg >= 400) {
              await this.vacas.push(vaca);
            }
          });
        });

        /*Get Vacas Vendidas */
        const VACASV: Vaca[][] = [];
        lotes.forEach(async (lote) => {
          const VACA = await this.getVacasVendidas(lote.id!);
          VACA.forEach(async (vaca) => {
            await this.vacasV.push(vaca);
          });
          VACASV.push(VACA);
        });
        console.log(this.vacasV);
      });
  }

  public async getVacas(loteId: string): Promise<Vaca[]> {
    return new Promise((resolve, reject) => {
      this.userService
        .getVacasByLoteId(loteId, 5, this.pagination * 5)
        .subscribe({
          next: (vaca) => {
            resolve(vaca);
          },
          error: () => {
            reject([]);
          },
        });
    });
  }

  public async getVacasVendidas(loteId: string): Promise<Vaca[]> {
    return new Promise((resolve, reject) => {
      this.userService.getVacasVendidasByLoteId(loteId, 0, 0).subscribe({
        next: (vaca) => {
          resolve(vaca);
        },
        error: () => {
          reject([]);
        },
      });
    });
  }

  public async getPeso(vacaId: string): Promise<Peso[]> {
    return new Promise((resolve, reject) => {
      this.userService.getPesoByVacaId(vacaId).subscribe({
        next: (peso) => {
          resolve(peso);
        },
        error: () => {
          reject([]);
        },
      });
    });
  }

  getLastPeso(pesos: Peso[]) {
    pesos = pesos.sort((a, b) => (a.dia! > b.dia! ? 1 : -1));
    const pesoActual = pesos[pesos.length - 1];
    return pesoActual;
  }

  paginationPlus() {
    this.pagination = this.pagination + 1;
    this.getVacas(this.loteId);
  }

  paginationLess() {
    this.pagination = this.pagination - 1;
    this.getVacas(this.loteId);
  }

  vender(vacaId: string) {
    this.router.navigate([`./user/${this.usuarioId}/vender-vaca/${vacaId}`]);
  }


  toVentas(){
    this.ventas = true;
    this.vendidas = false;
  }

  toVendidas(){
    this.vendidas = true;
    this.ventas = false;
  }

}
