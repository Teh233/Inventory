import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller } from 'src/auth/schema/users.schema';
import { Response, Request } from 'express';
import { roboproducts } from 'src/robo-products/schema/robo-products.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './schema/cart.schema';
import { FirebaseService } from 'src/notification/firebase.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private CartModel: Model<Cart>,
    @InjectModel(roboproducts.name)
    private RoboProductModel: Model<roboproducts>,
    @InjectModel(Seller.name)
    private SellerModel: Model<Seller>,
    private readonly firebaseService: FirebaseService,
  ) {}

  // add to cart
  async createCart(createCartDto: CreateCartDto, res: Response, req: Request) {
    try {
      const { sellerId, cartProducts } = createCartDto;
      
      if (!sellerId || !cartProducts || cartProducts.length === 0) {
        res.status(400).send({
          status: 'error',
          message: 'Please provide sellerId and roboProductIds',
        });
        return;
      }

      const seller = await this.SellerModel.findOne({ sellerId });
      if (!seller) {
        res.status(401).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }

      const oldCartData = await this.CartModel.findOne({ sellerId });
      if (!oldCartData) {
        const cartData = await this.CartModel.create({
          sellerId,
          cartProducts,
        });
      } else {
        const cartData = await this.CartModel.findOneAndUpdate(
          { sellerId },
          { $set: { cartProducts: cartProducts } },
          { new: true },
        );
      }

      const latestCartData = await this.CartModel.findOne({ sellerId });

      if (!latestCartData) {
        return res.status(404).send({
          status: 'error',
          message: 'Cart data not found',
        });
      } else {
    //     const adminId = "AID3317"
    //     const title = 'Cart Update'
    //     const bodys = `${(seller.name).charAt(0).toUpperCase()}${(seller.name).slice(1)}  has placed some items in cart.`;
    //     const url = 'http://localhost:5000/Cart'
    //     console.log(adminId,title,bodys,url)
        
    //  const cartign =   await this.firebaseService.sendNotificationToAdmin(adminId,title,bodys,url);
        return res.status(200).send({
          status: 'success',
          message: 'Cart Successfully Updated',
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // getCart
  async getCart(id: String, res: Response, req: Request) {
    try {
      const users:any = req.user
      const sellerId = users.sellerId
      const seller = await this.SellerModel.findOne({ sellerId: sellerId });
      if (!seller) {
        res.status(404).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }
      const cartData = await this.CartModel.findOne({ sellerId: id });

      if (cartData) {
        let subTotalSalesAmount = 0;
        let subTotalSellerAmount = 0;
        // Fetch price data for each cart item from the products collection/table
        const cartItems = await Promise.all(
          cartData.cartProducts.map(async (item: any, index: number) => {
            // Fetch the latest price data for the product using its SKU or ID
            const product = await this.RoboProductModel.findOne({
              SKU: item.SKU,
            });

            if (product) {
              const salesPrice = Number(product.SalesPrice);
              const sellerPrice = Number(product.SellerPrice);

              subTotalSalesAmount += item.quantity * salesPrice;
              subTotalSellerAmount += item.quantity * sellerPrice;
              const discountPercent = (((salesPrice - sellerPrice) / salesPrice) * 100).toFixed(2);
              return {
                ...item.toObject(),
                sellerPrice:sellerPrice,
                mainImage:product?.mainImage?.highUrl,
                salesPrice:salesPrice,
                id: index,
                salesPriceTotal: item.quantity * salesPrice,
                sellerPriceTotal: item.quantity * sellerPrice,
                discountPercent 
              };
            } else {
              // Handle the case when the product is not found
              return {
                ...item.toObject(),
                id: index,
                salesPriceTotal: 0,
                sellerPriceTotal: 0,
              };
            }
          }),
        );

        return res.status(200).send({
          status: 'success',
          message: 'Cart data successfully fetched',
          data: {
            subTotalSalesAmount: subTotalSalesAmount,
            subTotalSellerAmount: subTotalSellerAmount,
            cartData: cartItems,
          },
        });
      } else {
        return res.status(200).send({
          status: 'null',
          message: 'Cart empty',
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // updateQtyCart
  async updateQtyCart(id: string, res: Response, req: Request) {
    try {
      const { SKU, value, type } = req.body;

      if (!SKU || !id) {
        res.status(400).send({
          status: 'error',
          message: 'Please provide required inputs',
        });

        return;
      }

      const seller = await this.SellerModel.findOne({ sellerId: id });
      if (!seller) {
        res.status(401).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }

      const cartData = await this.CartModel.findOne({ sellerId: id });
      if (!cartData) {
        res.status(401).send({
          status: 'error',
          message: 'Cart not found',
        });
        return;
      }

      if (value) {
        const updatedCart = await this.CartModel.findOneAndUpdate(
          { sellerId: id, 'cartProducts.SKU': SKU },
          { $set: { 'cartProducts.$.quantity': value } },
          { new: true },
        ).exec();

        res.status(200).send({
          status: 'success',
          message: 'Cart Qty updated',
        });

        return;
      }
      const incrementBy = type === 'increase' ? 1 : -1;

      const updatedCart = await this.CartModel.findOneAndUpdate(
        { sellerId: id, 'cartProducts.SKU': SKU },
        { $inc: { 'cartProducts.$.quantity': incrementBy } },
        { new: true },
      ).exec();

      if (updatedCart) {
        for (const product of updatedCart.cartProducts as any) {
          if (product.SKU === SKU) {
            product.quantity = Math.max(1, product.quantity); // Ensure minimum quantity of 1
          }
        }

        await updatedCart.save();
      }

      res.status(200).send({
        status: 'success',
        message: 'Cart Qty updated',
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }

  // deleteCartItem
  async deleteCartItem(id: String, res: Response, sku: any) {
    try {
      console.log(sku);
      if (!sku || !id) {
        res.status(400).send({
          status: 'error',
          message: 'Please provide required inputs',
        });

        return;
      }
      const seller = await this.SellerModel.findOne({ sellerId: id });
      if (!seller) {
        res.status(401).send({
          status: 'error',
          message: 'Seller not found',
        });
        return;
      }
      const cartData = await this.CartModel.findOne({ sellerId: id });
      if (!cartData) {
        res.status(401).send({
          status: 'error',
          message: 'Cart not found',
        });
        return;
      }

      const updatedCart = await this.CartModel.findOneAndUpdate(
        { sellerId: id },
        { $pull: { cartProducts: { SKU: sku.sku } } },
        { new: true },
      ).exec();
      console.log(updatedCart);
      res.status(200).send({
        status: 'success',
        message: 'Product removed from cart',
      });
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: error.message,
      });
    }
  }
}
