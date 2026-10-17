import { TestBed } from '@angular/core/testing';
import { Linea, ResumenPedido } from './resumen-pedido';
import { Pedido } from './pedido';
import { Producto } from './tarjeta-producto';

describe('Pedido', () => {
  let pedido: Pedido;

  beforeEach(() => {
    pedido = new Pedido();
  });

  it('does not allow adding more units than the available stock', () => {
    const mango: Producto = {
      nombre: 'Mango',
      precio: 1800,
      existencias: 2,
    };

    pedido.agregarProducto(mango);
    pedido.agregarProducto(mango);
    pedido.agregarProducto(mango);

    expect(pedido.cantidadEnPedido('Mango')).toBe(2);
  });

  it('removes a product from the order', () => {
    pedido.agregarProducto(pedido.productos[0]);

    pedido.quitarProducto('Mango');

    expect(pedido.cantidadEnPedido('Mango')).toBe(0);
  });
});

describe('ResumenPedido', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenPedido],
    }).compileComponents();
  });

  function crearResumen(lineas: Linea[]): ResumenPedido {
    const fixture = TestBed.createComponent(ResumenPedido);
    fixture.componentRef.setInput('lineas', lineas);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('adds the delivery fee when the subtotal is below the free-delivery minimum', () => {
    const resumen = crearResumen([{ nombre: 'Mango', precio: 12000, cantidad: 1 }]);

    expect(resumen.subtotal()).toBe(12000);
    expect(resumen.domicilioValor()).toBe(3000);
    expect(resumen.total()).toBe(15000);
  });

  it('waives the delivery fee when the subtotal reaches the minimum', () => {
    const resumen = crearResumen([
      { nombre: 'Mango', precio: 12000, cantidad: 1 },
      { nombre: 'Aguacate', precio: 8000, cantidad: 1 },
    ]);

    expect(resumen.esDomicilioGratis()).toBe(true);
    expect(resumen.domicilioValor()).toBe(0);
    expect(resumen.total()).toBe(20000);
  });
});
