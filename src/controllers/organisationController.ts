import { Response } from "express";
import { UserRole } from "../types";
import { Organization, User, Field } from "../models";
import { AuthRequest } from "../types";
import asyncHandleWrapper from "../middleware/asyncHandlewrapp";
import { Auth } from "mongodb";

/**
 * @desc
 * @access
 * @route
 */

export const getOrganisation = asyncHandleWrapper(async (Req: AuthRequest, req: Request) => {

})