// models/Property.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    // BASIC DETAILS
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    purpose: {
      type: String,
      enum: ["rent", "sale"],
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "flat",
        "apartment",
        "house",
        "villa",
        "studio",
        "pg",
        "shop",
        "office",
        "plot",
        "warehouse",
      ],
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      index: true,
    },

    priceType: {
      type: String,
      enum: ["monthly", "yearly", "total"],
      default: "monthly",
    },

    bhk: {
      type: Number,
      min: 0,
      index: true,
    },

    bathrooms: {
      type: Number,
      min: 0,
      index: true,
    },

    // AREA
    totalArea: {
      type: Number,
      required: true,
      index: true,
    },

    areaUnit: {
      type: String,
      enum: ["sqft", "sqm", "marla", "kanal", "acre"],
      default: "sqft",
    },

    // LOCATION
city: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
  index: true
},

    sector: {
      type: String,
      trim: true,
      index: true,
    },

    locality: {
      type: String,
      trim: true,
      index: true,
    },

    landmark: {
      type: String,
      trim: true,
    },

    fullAddress: {
      type: String,
      trim: true,
    },

    coordinates: {
      lat: Number,
      lng: Number,
    },

    // FEATURES
    furnishing: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "fully-furnished"],
      default: "unfurnished",
      index: true,
    },

    parking: {
      type: String,
      enum: ["none", "bike", "car", "both"],
      default: "none",
      index: true,
    },

    age: {
      type: Number, // in years
      min: 0,
      default: 0,
      index: true,
    },

    // AMENITIES (SCALABLE)
    amenities: [
      {
        type: String,
        enum: [
          "lift",
          "gym",
          "power_backup",
          "swimming_pool",
          "security",
          "clubhouse",
          "park",
          "near_market",
        ],
      },
    ],

    // CONTENT
    description: {
      type: String,
      trim: true,
    },
    notes:{
      type: String,
      trim: true,
    },
    documents:{
  type: [
    {
      url: String,
    },
  ],
  validate: {
    validator: function (arr) {
      return arr.length >= 0 && arr.length <= 10;
    },
    message: "Documents must be between 0 and 10",
  },
},

images: {
  type: [
    {
      url: String,
    },
  ],
  validate: {
    validator: function (arr) {
      return arr.length >= 0 && arr.length <= 10;
    },
    message: "Images must be between 0 and 10",
  },
},
    // OWNER / AGENT
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // STATUS
    status: {
      type: String,
      enum: ["available", "sold", "pending"],
      default: "available",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   PRE-SAVE HOOKS
========================= */

// Generate slug from title before saving
propertySchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  const Property = mongoose.model("Property");

  let baseSlug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  let slug = baseSlug;
  let count = 1;

  while (
    await Property.exists({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});
/* =========================
   INDEXES FOR FAST FILTERING
========================= */

propertySchema.index({ city: 1, purpose: 1, category: 1 });
propertySchema.index({ amenities: 1 });
propertySchema.index({ createdAt: -1 });

export default mongoose.model("Property", propertySchema);