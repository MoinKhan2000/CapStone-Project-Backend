import { ErrorHandler } from "../../../utils/errorHandler.js";
import {
  addNewProductRepo,
  deleProductRepo,
  findProductRepo,
  getAllProductsRepo,
  getProductDetailsRepo,
  getTotalCountsOfProduct,
  updateProductRepo,
} from "../model/product.repository.js";

export const addNewProduct = async (req, res, next) => {
  try {
    const product = await addNewProductRepo({
      ...req.body,
      createdBy: req.user._id,
    });
    if (product) {
      res.status(201).json({ success: true, product });
    } else {
      return next(new ErrorHandler(400, "some error occurred!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    // Category filtering
    const category = req.query.category ? { category: req.query.category } : {};

    // Price range filtering
    const priceFilter = {};
    if (req.query.price) {
      if (req.query.price.gte) {
        priceFilter.price = { ...priceFilter.price, $gte: Number(req.query.price.gte) };
      }
      if (req.query.price.lte) {
        priceFilter.price = { ...priceFilter.price, $lte: Number(req.query.price.lte) };
      }
    }

    // REview Filter
    const reviewFilter = {}
    if (req.query.rating) {
      if (req.query.rating.gte) {
        reviewFilter.rating = { ...reviewFilter.rating, $gte: Number(req.query.rating.gte) };
      }
      if (req.query.rating.lte) {
        reviewFilter.rating = { ...reviewFilter.rating, $lte: Number(req.query.rating.lte) };
      }
    }

    // Combine all filters
    const query = { ...keyword, ...category, ...priceFilter, ...reviewFilter };
    console.log(query);

    // Pagination setup
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch total count of products (with applied filters)
    const totalProducts = await getTotalCountsOfProduct(query);

    // Fetch the products with filters, search, and pagination
    const products = await getAllProductsRepo(query, { skip, limit });

    res.status(200).json({
      success: true,
      totalProducts,
      count: products.length,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await updateProductRepo(req.params.id, req.body);
    if (updatedProduct) {
      res.status(200).json({ success: true, updatedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await deleProductRepo(req.params.id);
    if (deletedProduct) {
      res.status(200).json({ success: true, deletedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getProductDetails = async (req, res, next) => {
  try {
    const productDetails = await getProductDetailsRepo(req.params.id);
    if (productDetails) {
      res.status(200).json({ success: true, productDetails });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const rateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const user = req.user._id;
    const name = req.user.name;
    const review = {
      user,
      name,
      rating: Number(rating),
      comment,
    };
    if (!rating) {
      return next(new ErrorHandler(400, "rating can't be empty"));
    }
    const product = await findProductRepo(productId);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    const findRevieweIndex = product.reviews.findIndex((rev) => {
      return rev.user.toString() === user.toString();
    });
    if (findRevieweIndex >= 0) {
      product.reviews.splice(findRevieweIndex, 1, review);
    } else {
      product.reviews.push(review);
    }
    let avgRating = 0;
    product.reviews.forEach((rev) => {
      avgRating += rev.rating;
    });
    const updatedRatingOfProduct = avgRating / product.reviews.length;
    product.rating = updatedRatingOfProduct;
    await product.save({ validateBeforeSave: false });
    res
      .status(201)
      .json({ success: true, msg: "thanks for rating the product", product });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getAllReviewsOfAProduct = async (req, res, next) => {
  try {
    const product = await findProductRepo(req.params.id);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.query;
    const userId = req.user._id;

    // Check if both productId and reviewId are provided
    if (!productId || !reviewId) {
      return next(
        new ErrorHandler(
          400,
          "Please provide productId and reviewId as query params"
        )
      );
    }

    // Find the product by ID
    const product = await findProductRepo(productId);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }

    // Find the index of the review to be deleted
    const isReviewExistIndex = product.reviews.findIndex((rev) => {
      return rev._id.toString() === reviewId.toString();
    });

    // Check if the review exists
    if (isReviewExistIndex < 0) {
      return next(new ErrorHandler(400, "Review doesn't exist"));
    }

    // Check if the user is authorized to delete this review
    const reviewToBeDeleted = product.reviews[isReviewExistIndex];
    if (reviewToBeDeleted.user.toString() !== userId.toString()) {
      return next(new ErrorHandler(403, "You are not authorized to delete this review"));
    }

    // Remove the review from the reviews array
    product.reviews.splice(isReviewExistIndex, 1);

    // Recalculate the product rating
    let avgRating = 0;
    product.reviews.forEach((rev) => {
      avgRating += rev.rating;
    });
    product.rating = product.reviews.length ? avgRating / product.reviews.length : 0;

    // Save the updated product
    await product.save({ validateBeforeSave: false });

    // Send a response with the deleted review and updated product information
    res.status(200).json({
      success: true,
      msg: "Review deleted successfully",
      deletedReview: reviewToBeDeleted,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

