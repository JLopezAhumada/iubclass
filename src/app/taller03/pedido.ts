import { Component, signal } from '@angular/core';
import { Linea, ResumenPedido } from './resumen-pedido';
import { Producto, TarjetaProducto } from './tarjeta-producto';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [TarjetaProducto, ResumenPedido],
  template: `
    <main class="pedido-layout">
      <h1>Realizar pedido</h1>

      <div class="grid-container">
        <section class="tarjetas-grid" aria-label="Productos disponibles">
          @for (producto of productos; track producto.nombre) {
            <app-tarjeta-producto
              [producto]="producto"
              [cantidadEnPedido]="cantidadEnPedido(producto.nombre)"
              (agregar)="agregarProducto($event)"
            />
          }
        </section>

        <app-resumen-pedido [lineas]="pedido()" (quitar)="quitarProducto($event)" />
      </div>
    </main>
  `,
  styles: [
    `
      .pedido-layout {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      .pedido-layout h1 {
        margin-bottom: 30px;
        color: #2c3e50;
        text-align: center;
      }

      .grid-container {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 380px;
        gap: 24px;
      }

      .tarjetas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        align-content: start;
        gap: 16px;
      }

      @media (max-width: 768px) {
        .grid-container {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class Pedido {
  readonly productos: Producto[] = [
    { nombre: 'Mango', precio: 1800, existencias: 3 },
    { nombre: 'Aguacate', precio: 4500, existencias: 2 },
    { nombre: 'Limón', precio: 650, existencias: 10 },
    { nombre: 'Queso costeño', precio: 12000, existencias: 1 },
  ];

  readonly pedido = signal<Linea[]>([]);

  cantidadEnPedido(nombre: string): number {
    return this.pedido().find((linea) => linea.nombre === nombre)?.cantidad ?? 0;
  }

  agregarProducto(producto: Producto): void {
    this.pedido.update((lineas) => {
      const lineaExistente = lineas.find((linea) => linea.nombre === producto.nombre);
      const cantidadActual = lineaExistente?.cantidad ?? 0;

      if (cantidadActual >= producto.existencias) {
        return lineas;
      }

      if (lineaExistente) {
        return lineas.map((linea) =>
          linea.nombre === producto.nombre ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
        );
      }

      return [...lineas, { nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    });
  }

  quitarProducto(nombre: string): void {
    this.pedido.update((lineas) => lineas.filter((linea) => linea.nombre !== nombre));
  }
}
