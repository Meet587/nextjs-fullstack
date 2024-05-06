import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  userName: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Verification code",
      react: VerificationEmail({ username: userName, otp: verifyCode }),
    });

    return {
      success: true,
      message: "verification email email send successfully.",
    };
  } catch (error) {
    console.error("error sending verification email.", error);
    return { success: false, message: "fail to send verification email." };
  }
}
