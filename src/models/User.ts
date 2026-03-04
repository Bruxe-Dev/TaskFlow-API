import {
    Model, Schema
} from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { IUser, UserRole } from '../types/index'

