import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article class="card">
      <div class="card-body">
        <h3>{{ producto().nombre }}</h3>
        <p class="precio">
          {{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
        </p>
        <p class="disponibles">Disponibles: {{ disponibles() }}</p>
        <button
          class="btn-agregar"
          type="button"
          [disabled]="disponibles() === 0"
          (click)="agregar.emit(producto())"
        >
          Agregar al pedido
        </button>
      </div>
    </article>
  `,
  styles: [
    `
      .card {
        padding: 16px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
      }

      .card-body h3 {
        margin: 0 0 8px;
        color: #333;
        font-size: 1.2rem;
      }

      .precio {
        margin: 4px 0;
        color: #2e7d32;
        font-weight: bold;
      }

      .disponibles {
        margin: 4px 0 12px;
        color: #666;
        font-size: 0.9rem;
      }

      .btn-agregar {
        width: 100%;
        padding: 8px 16px;
        color: white;
        background: #1976d2;
        border: 0;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      }

      .btn-agregar:disabled {
        background: #bdbdbd;
        cursor: not-allowed;
      }
    `,
  ],
})
export class TarjetaProducto {
  readonly producto = input.required<Producto>();
  readonly cantidadEnPedido = input(0);
  readonly agregar = output<Producto>();

  readonly disponibles = computed(() =>
    Math.max(this.producto().existencias - this.cantidadEnPedido(), 0),
  );
}
