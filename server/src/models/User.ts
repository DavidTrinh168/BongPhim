import {Schema, model, Document, Types} from 'mongoose';

export interface IUser extends Document {
    username: string;
    full_name: string;
    email: string;
    password: string;
    birth_date: Date;
    phone: string;
    avatar_url?: string;
    role: 'user' | 'admin' |'moderator';
    is_active: boolean;
    email_verified: boolean;
    auth_provider: 'local' | 'google' | 'facebook';
    provider_id: string;
    fav_movies: Types.ObjectId[];
    sub_plan: 'free' | 'basic' | 'premium';
    // sub_expiration: Date;
    refresh_token: string;
    email_verification_token: string;
    reset_password_token?: string,
    reset_password_expires?: Date
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, trim: true, unique: true },
        full_name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true },
        birth_date: { type: Date, required: true },
        phone: { type: String, required: true, trim: true },
        avatar_url: { type: String, trim: true },
        role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
        is_active: { type: Boolean, default: true },
        email_verified: { type: Boolean, default: false },
        auth_provider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
        provider_id: { type: String, trim: true },
        fav_movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
        sub_plan: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
        // sub_expiration: { type: Date },
        refresh_token: { type: String, trim: true },
        email_verification_token: { type: String, trim: true },
        reset_password_token: { type: String, trim: true },
        reset_password_expires: { type: Date }
    },
    { timestamps: true },
);

const User = model<IUser>('User', UserSchema);
export default User;