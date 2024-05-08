import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVarificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, email, password } = await request.json();

    const existingUserVerifiedByUserName = await UserModal.findOne({
      userName,
      isVerified: true,
    });

    if (existingUserVerifiedByUserName) {
      return Response.json(
        { success: false, message: "user name is alredy taken." },
        { status: 400 }
      );
    }

    const existingUserVerifiedByEmail = await UserModal.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerified) {
        return Response.json(
          { success: false, message: "user is already exist with this email." },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserVerifiedByEmail.password = hashedPassword;
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 720000
        );

        await existingUserVerifiedByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 2);

      const newUser = new UserModal({
        userName,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "user register successfully and verify email send.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error in register user", error);
    return Response.json(
      { success: false, message: "Error in register user" },
      { status: 500 }
    );
  }
}
