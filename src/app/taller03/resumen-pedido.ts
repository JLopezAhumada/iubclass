import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

const TARIFA_DOMICILIO = 3000;
const MINIMO_DOMICILIO_GRATIS = 20000;

export interface Linea {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-resumen-pedido',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <section class="resumen-container">
      <h2>Resumen del pedido</h2>

      <div class="lineas-list">
        @for (item of lineas(); track item.nombre) {
          <div class="linea-item">
            <div class="linea-info">
              <span class="linea-nombre">{{ item.nombre }}</span>
              <span class="linea-detalle">
                {{ item.cantidad }} x
                {{ item.precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
                =
                <strong>
                  {{ item.precio * item.cantidad | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
                </strong>
              </span>
            </div>
            <button
              class="btn-quitar"
              type="button"
              (click)="quitar.emit(item.nombre)"
              [attr.aria-label]="'Quitar ' + item.nombre + ' del pedido'"
            >
              Quitar
            </button>
          </div>
        } @empty {
          <div class="empty-box">
            <p>El pedido está vacío</p>
          </div>
        }
      </div>

      <div class="totales-box">
        <div class="total-row">
          <span>Subtotal:</span>
          <strong>
            {{ subtotal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
          </strong>
        </div>
        <div class="total-row">
          <span>Domicilio:</span>
          @if (lineas().length === 0) {
            <strong>—</strong>
          } @else if (esDomicilioGratis()) {
            <strong class="texto-gratis">Gratis</strong>
          } @else {
            <strong>
              {{ domicilioValor() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
            </strong>
          }
        </div>
        <hr />
        <div class="total-row total-final">
          <span>Total:</span>
          <strong>
            {{ total() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
          </strong>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .resumen-container {
        align-self: start;
        padding: 20px;
        background: #f9f9f9;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
      }

      .resumen-container h2 {
        margin-top: 0;
        color: #333;
        font-size: 1.3rem;
      }

      .lineas-list {
        margin-bottom: 20px;
      }

      .linea-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
      }

      .linea-info {
        display: flex;
        flex-direction: column;
      }

      .linea-nombre {
        color: #333;
        font-weight: 600;
      }

      .linea-detalle {
        color: #666;
        font-size: 0.9rem;
      }

      .btn-quitar {
        padding: 6px 12px;
        color: white;
        background: #d32f2f;
        border: 0;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
      }

      .empty-box {
        padding: 15px;
        color: #856404;
        background: #fff3cd;
        border-radius: 6px;
        text-align: center;
        font-weight: 500;
      }

      .empty-box p {
        margin: 0;
      }

      .totales-box {
        padding: 15px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
      }

      .total-final {
        margin-top: 8px;
        color: #1976d2;
        font-size: 1.2rem;
      }

      .texto-gratis {
        color: #2e7d32;
      }
    `,
  ],
})
export class ResumenPedido {
  readonly lineas = input.required<Linea[]>();
  readonly quitar = output<string>();

  readonly subtotal = computed(() =>
    this.lineas().reduce((total, linea) => total + linea.precio * linea.cantidad, 0),
  );

  readonly esDomicilioGratis = computed(() => this.subtotal() >= MINIMO_DOMICILIO_GRATIS);

  readonly domicilioValor = computed(() =>
    this.lineas().length === 0 || this.esDomicilioGratis() ? 0 : TARIFA_DOMICILIO,
  );

  readonly total = computed(() => this.subtotal() + this.domicilioValor());
}
