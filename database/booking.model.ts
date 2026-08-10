import { Schema, model, models, Types, HydratedDocument } from "mongoose";

// TypeScript interface for Booking document
export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<IBooking>;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  },
);

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Create compound index for common queries (events bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user booking lookups
BookingSchema.index({ email: 1 });

// Enforce one booking per events per email
BookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: "uniq_event_email" },
);

// Pre-save hook to validate events exists before creating booking
BookingSchema.pre("save", async function (this: BookingDocument) {
  // Only validate eventId if it's new or modified
  if (this.isModified("eventId") || this.isNew) {
    const EventModel = models.Event || model("Event");

    try {
      const eventExists = await EventModel.findById(this.eventId).select("_id");

      if (!eventExists) {
        const error = new Error(`Event with ID ${this.eventId} does not exist`);
        error.name = "ValidationError";
        throw error;
      }
    } catch (err) {
      if (err instanceof Error && err.name === "ValidationError") {
        throw err;
      }
      const validationError = new Error(
        "Invalid events ID format or database error",
      );
      validationError.name = "ValidationError";
      throw validationError;
    }
  }
});

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
