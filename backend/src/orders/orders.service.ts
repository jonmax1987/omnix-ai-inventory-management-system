import { Injectable, NotFoundException } from '@nestjs/common';
import { 
  CreateOrderDto, 
  UpdateOrderDto, 
  Order, 
  OrderStatus, 
  OrderPriority,
  OrderItem,
  OrderSummary 
} from '../common/dto/order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private orderCounter = 1000;

  // Mock product data for order items
  private mockProducts = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Premium Coffee Beans',
      sku: 'PCB-001',
      price: 24.99,
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174001',
      name: 'Organic Green Tea',
      sku: 'OGT-002',
      price: 12.99,
    },
    {
      id: '323e4567-e89b-12d3-a456-426614174002',
      name: 'Whole Wheat Flour',
      sku: 'WWF-003',
      price: 8.99,
    },
  ];

  constructor() {
    // Initialize with some mock orders
    this.initializeMockOrders();
  }

  private initializeMockOrders(): void {
    const mockOrder1: Order = {
      id: uuidv4(),
      orderNumber: `ORD-${this.orderCounter++}`,
      supplier: 'Global Coffee Co.',
      items: [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          productName: 'Premium Coffee Beans',
          sku: 'PCB-001',
          quantity: 100,
          unitPrice: 24.99,
          totalPrice: 2499.00,
        },
      ],
      totalItems: 100,
      totalAmount: 2499.00,
      status: OrderStatus.PENDING,
      priority: OrderPriority.HIGH,
      createdBy: '1',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 604800000).toISOString(), // 1 week from now
      notes: 'Urgent restock needed',
    };

    const mockOrder2: Order = {
      id: uuidv4(),
      orderNumber: `ORD-${this.orderCounter++}`,
      supplier: 'Organic Tea Ltd.',
      items: [
        {
          productId: '223e4567-e89b-12d3-a456-426614174001',
          productName: 'Organic Green Tea',
          sku: 'OGT-002',
          quantity: 50,
          unitPrice: 12.99,
          totalPrice: 649.50,
        },
      ],
      totalItems: 50,
      totalAmount: 649.50,
      status: OrderStatus.APPROVED,
      priority: OrderPriority.MEDIUM,
      createdBy: '1',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 1209600000).toISOString(), // 2 weeks from now
      approvedBy: '1',
      approvedAt: new Date(Date.now() - 86400000).toISOString(),
    };

    this.orders.push(mockOrder1, mockOrder2);
  }

  async getAllOrders(
    status?: OrderStatus,
    priority?: OrderPriority,
    supplier?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ orders: Order[]; total: number; pages: number }> {
    let filteredOrders = [...this.orders];

    // Apply filters
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    if (priority) {
      filteredOrders = filteredOrders.filter(order => order.priority === priority);
    }
    if (supplier) {
      filteredOrders = filteredOrders.filter(order => 
        order.supplier.toLowerCase().includes(supplier.toLowerCase())
      );
    }

    // Sort by created date (newest first)
    filteredOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const total = filteredOrders.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      total,
      pages,
    };
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orders.find(order => order.id === orderId) || null;
  }

  async createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    // Enrich order items with product information
    const enrichedItems: OrderItem[] = [];
    let totalAmount = 0;
    let totalItems = 0;

    for (const item of createOrderDto.items) {
      const product = this.mockProducts.find(p => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      const orderItem: OrderItem = {
        productId: item.productId,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        notes: item.notes,
      };

      enrichedItems.push(orderItem);
      totalAmount += orderItem.totalPrice;
      totalItems += item.quantity;
    }

    const newOrder: Order = {
      id: uuidv4(),
      orderNumber: `ORD-${this.orderCounter++}`,
      supplier: createOrderDto.supplier,
      items: enrichedItems,
      totalItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: OrderStatus.PENDING,
      priority: createOrderDto.priority,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expectedDeliveryDate: createOrderDto.expectedDeliveryDate,
      notes: createOrderDto.notes,
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrder(
    orderId: string, 
    updateOrderDto: UpdateOrderDto, 
    userId: string
  ): Promise<Order | null> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return null;
    }

    const order = this.orders[orderIndex];
    
    // Handle status transitions
    if (updateOrderDto.status) {
      // If approving the order, record who approved it
      if (updateOrderDto.status === OrderStatus.APPROVED && order.status === OrderStatus.PENDING) {
        order.approvedBy = userId;
        order.approvedAt = new Date().toISOString();
      }
      
      // If marking as received, set the actual delivery date
      if (updateOrderDto.status === OrderStatus.RECEIVED && order.status !== OrderStatus.RECEIVED) {
        order.actualDeliveryDate = new Date().toISOString();
      }

      order.status = updateOrderDto.status;
    }

    // Update other fields
    if (updateOrderDto.priority !== undefined) {
      order.priority = updateOrderDto.priority;
    }
    if (updateOrderDto.expectedDeliveryDate !== undefined) {
      order.expectedDeliveryDate = updateOrderDto.expectedDeliveryDate;
    }
    if (updateOrderDto.trackingNumber !== undefined) {
      order.trackingNumber = updateOrderDto.trackingNumber;
    }
    if (updateOrderDto.notes !== undefined) {
      order.notes = updateOrderDto.notes;
    }

    order.updatedAt = new Date().toISOString();
    this.orders[orderIndex] = order;

    return order;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return false;
    }

    // Only allow deletion of pending or cancelled orders
    const order = this.orders[orderIndex];
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CANCELLED) {
      throw new Error('Cannot delete order that is already in progress');
    }

    this.orders.splice(orderIndex, 1);
    return true;
  }

  async getOrderSummary(): Promise<OrderSummary> {
    const totalOrders = this.orders.length;
    const pendingOrders = this.orders.filter(o => o.status === OrderStatus.PENDING).length;
    const approvedOrders = this.orders.filter(o => o.status === OrderStatus.APPROVED).length;
    const shippedOrders = this.orders.filter(o => o.status === OrderStatus.SHIPPED).length;
    const receivedOrders = this.orders.filter(o => o.status === OrderStatus.RECEIVED).length;
    
    const totalOrderValue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalOrderValue / totalOrders : 0;

    const ordersByPriority = {
      urgent: this.orders.filter(o => o.priority === OrderPriority.URGENT).length,
      high: this.orders.filter(o => o.priority === OrderPriority.HIGH).length,
      medium: this.orders.filter(o => o.priority === OrderPriority.MEDIUM).length,
      low: this.orders.filter(o => o.priority === OrderPriority.LOW).length,
    };

    const recentOrders = this.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalOrders,
      pendingOrders,
      approvedOrders,
      shippedOrders,
      receivedOrders,
      totalOrderValue: Math.round(totalOrderValue * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      ordersByPriority,
      recentOrders,
    };
  }
}