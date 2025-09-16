export const otpEmailTemplate = (otpCode) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>DevPoster OTP Verification</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Helvetica', Arial, sans-serif;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    "
  >
    <div
      style="
        width: 100%;
        height: 100%;
        padding: 0;
        background-color: #ece9e9;
        margin: 0 auto;
        overflow: hidden;
      "
    >
      <h1
        style="
          background-color: #3c83f6;
          padding: 8px;
          text-align: center;
          color: #f5f5f4;
          margin: 0;
        "
      >
        DEVPOSTR
      </h1>

      <div style="overflow: hidden">
        <h2 style="text-align: center">Verify Your Email</h2>
        <p
          style="
            font-size: 16px;
            line-height: 1.5;
            text-align: center;
            padding: 8px;
          "
        >
          Enter the following OTP code in DevPostr website to verify your email
          address. This code expire in <strong>5 minutes</strong>
        </p>
        <div style="width: 100%; text-align: center">
          <div
            style="
              display: inline-block;
              font-size: 24px;
              letter-spacing: 4px;
              font-weight: bold;
              background-color: #f0f0f0;
              padding: 15px 30px;
              border-radius: 8px;
              color: #3c83f6;
              text-align: center;
            "
          >
            ${otpCode}
          </div>
        </div>
        <p
          style="
            font-size: 16px;
            line-height: 1.5;
            padding: 8px;
            color: #7e7e7e;
            font-weight: lighter;
            font-size: 14px;
            text-align: center;
          "
        >
          If you did not request this code, please ignore this email
        </p>

        <div
          style="
            background-color: #f8f8f8;
            padding: 20px;
            color: #777777;
            font-size: 12px;
            text-align: center;
            margin: 0;
          "
        >
          <div style="text-align: center">
            &copy; 2025 DevPostr. All rights reserved.
          </div>
          <a href="https://devpostr.vercel.app/" style="color: #0d6efd; text-decoration: none"
            >Visit Site</a
          >
        </div>
      </div>
    </div>
  </body>
</html>
`;

export const welcomeEmailTemplate = (name) => `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to DevPostr</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Helvetica', Arial, sans-serif;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    "
  >
    <div
      style="
        width: 100%;
        height: 100%;
        padding: 0;
        background-color: #ece9e9;
        margin: 0 auto;
        overflow: hidden;
      "
    >
      <h1
        style="
          background-color: #3c83f6;
          padding: 8px;
          text-align: center;
          color: #f5f5f4;
          margin: 0;
        "
      >
        DEVPOSTR
      </h1>

      <div style="overflow: hidden">
        <h2 style="text-align: center">Welcome to DevPostr!</h2>
        <p
          style="
            font-size: 16px;
            line-height: 1.5;
            text-align: center;
            padding: 8px;
          "
        >
          Hi ${name}, we're excited to have you on board! DevPostr helps
          you showcase your projects, connect with other developers, and grow
          your skills. Start exploring now!
        </p>

        <div style="width: 100%; text-align: center">
          <a
            href="https://devpostr.vercel.app/dashboard"
            style="
              display: inline-block;
              font-size: 16px;
              font-weight: bold;
              background-color: #3c83f6;
              color: #ffffff;
              padding: 15px 30px;
              border-radius: 8px;
              text-decoration: none;
              margin: 20px 0;
            "
          >
            Get Started
          </a>
        </div>

        <p
          style="
            font-size: 14px;
            line-height: 1.5;
            padding: 8px;
            color: #7e7e7e;
            font-weight: lighter;
            text-align: center;
          "
        >
          If you have any questions, feel free to
          <a
            href="mailto:devpostr@gmail.com"
            style="color: #0d6efd; text-decoration: none"
            >contact us</a
          >.
        </p>

        <div
          style="
            background-color: #f8f8f8;
            padding: 20px;
            color: #777777;
            font-size: 12px;
            text-align: center;
            margin: 0;
          "
        >
          <div style="text-align: center">
            &copy; 2025 DevPostr. All rights reserved.
          </div>
          <a href="https://devpostr.vercel.app/" style="color: #0d6efd; text-decoration: none"
            >Visit Site</a
          >
        </div>
      </div>
    </div>
  </body>
</html>
`;
