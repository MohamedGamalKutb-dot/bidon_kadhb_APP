import { APPLICATION_NAME } from "../../../config.js";
import { EmailSubjectEnum } from "../../enum/email.enum.js";
export const templates={
    [EmailSubjectEnum.CONFIRM_EMAIL]:(data)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
    }
    table {
      border-collapse: collapse;
    }
    a {
      text-decoration: none;
    }
  </style>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #ffffff;">

  <center>
    <!-- الحاوية الخارجية مع الإطار الخفيف كما في الصورة -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #f7f7f7; border: 1px solid #751733;">
      
      <!-- شريط العنوان واللوجو -->
      <tr>
        <td style="padding: 25px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="left" style="font-size: 22px; font-weight: 900; color: #000000; letter-spacing: -0.5px;">
               ${APPLICATION_NAME}
              </td>
              <td align="right">
                <a href="https://example.com" style="color: #4a55a2; font-size: 13px; font-weight: bold;">View in Website</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- الصندوق الداخلي الأبيض الرئيسي -->
      <tr>
        <td align="center" style="padding: 0 25px 25px 25px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff;">
            
            <!-- الصندوق النبيتي العلوي مع أيقونة البريد -->
            <tr>
              <td align="center" style="background-color: #6a1329; padding: 40px 20px;">
                <!-- أيقونة ظرف البريد SVG -->
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </td>
            </tr>

            <!-- عنوان Confirm_Email -->
            <tr>
              <td align="center" style="padding: 35px 20px 25px 20px;">
                <h2 style="margin: 0; font-size: 24px; font-weight: bold; color: #6a1329; letter-spacing: 0.5px;">
                  ${data.title}
                </h2>
              </td>
            </tr>

            <!-- زر / شريط كود الـ OTP -->
            <tr>
              <td align="center" style="padding: 0 20px 35px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="background-color: #6a1329; border-radius: 4px; padding: 12px 10px;">
                      <span style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #ffffff; letter-spacing: 3px;">
                       ${data.code}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- قسم التواصل الاجتماعي Stay in touch -->
      <tr>
        <td align="center" style="padding: 10px 20px 5px 20px;">
          <span style="font-size: 14px; font-weight: bold; color: #000000;">
            Stay in touch
          </span>
        </td>
      </tr>

      <!-- أيقونات مواقع التواصل الدائرية -->
      <tr>
        <td align="center" style="padding: 15px 20px 30px 20px;">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <!-- فيسبوك -->
              <td align="center" style="padding: 0 8px;">
                <a href="#" style="display: inline-block; width: 38px; height: 38px; background-color: #1877f2; border-radius: 50%; text-align: center; line-height: 38px; color: #ffffff; font-weight: bold; font-size: 18px; font-family: sans-serif;">
                  f
                </a>
              </td>
              <!-- إنستغرام -->
              <td align="center" style="padding: 0 8px;">
                <a href="#" style="display: inline-block; width: 38px; height: 38px; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); background-color: #e1306c; border-radius: 50%; text-align: center; line-height: 38px; color: #ffffff; font-size: 18px;">
                  &#9678;
                </a>
              </td>
              <!-- تويتر / X -->
              <td align="center" style="padding: 0 8px;">
                <a href="#" style="display: inline-block; width: 38px; height: 38px; background-color: #1da1f2; border-radius: 50%; text-align: center; line-height: 38px; color: #ffffff; font-size: 16px;">
                  &#128038;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>`;
    },
    
    [EmailSubjectEnum.FORGOT_PASSWORD]:(data)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
    }
    table {
      border-collapse: collapse;
    }
    a {
      text-decoration: none;
    }
  </style>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #ffffff;">

  <center>
    <!-- الحاوية الخارجية مع الإطار الخفيف كما في الصورة -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #f7f7f7; border: 1px solid #751733;">
      
      <!-- شريط العنوان واللوجو -->
      <tr>
        <td style="padding: 25px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="left" style="font-size: 22px; font-weight: 900; color: #000000; letter-spacing: -0.5px;">
               ${APPLICATION_NAME}
              </td>
              <td align="right">
                <a href="https://example.com" style="color: #4a55a2; font-size: 13px; font-weight: bold;">View in Website</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- الصندوق الداخلي الأبيض الرئيسي -->
      <tr>
        <td align="center" style="padding: 0 25px 25px 25px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff;">
            
            <!-- الصندوق النبيتي العلوي مع أيقونة البريد -->
            <tr>
              <td align="center" style="background-color: #6a1329; padding: 40px 20px;">
                <!-- أيقونة ظرف البريد SVG -->
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </td>
            </tr>

            <!-- عنوان Confirm_Email -->
            <tr>
              <td align="center" style="padding: 35px 20px 25px 20px;">
                <h2 style="margin: 0; font-size: 24px; font-weight: bold; color: #6a1329; letter-spacing: 0.5px;">
                  ${data.title}
                </h2>
              </td>
            </tr>

            <!-- زر / شريط كود الـ OTP -->
            <tr>
              <td align="center" style="padding: 0 20px 35px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="background-color: #6a1329; border-radius: 4px; padding: 12px 10px;">
                      <span style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #ffffff; letter-spacing: 3px;">
                       ${data.code}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- قسم التواصل الاجتماعي Stay in touch -->
      <tr>
        <td align="center" style="padding: 10px 20px 5px 20px;">
          <span style="font-size: 14px; font-weight: bold; color: #000000;">
            Stay in touch
          </span>
        </td>
      </tr>

      <!-- أيقونات مواقع التواصل الدائرية -->
      <tr>
        <td align="center" style="padding: 15px 20px 30px 20px;">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <!-- فيسبوك -->
              <td align="center" style="padding: 0 8px;">
                <a href="#" style="display: inline-block; width: 38px; height: 38px; background-color: #1877f2; border-radius: 50%; text-align: center; line-height: 38px; color: #ffffff; font-weight: bold; font-size: 18px; font-family: sans-serif;">
                  f
                </a>
              </td>
              <!-- إنستغرام -->
              <td align="center" style="padding: 0 8px;">
                <a href="#" style="display: inline-block; width: 38px; height: 38px; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); background-color: #e1306c; border-radius: 50%; text-align: center; line-height: 38px; color: #ffffff; font-size: 18px;">
                  &#9678;
                </a>
              </td>
              <!-- تويتر / X -->
              <td align="center" style="padding: 0 8px;">
                <a href="#" style="display: inline-block; width: 38px; height: 38px; background-color: #1da1f2; border-radius: 50%; text-align: center; line-height: 38px; color: #ffffff; font-size: 16px;">
                  &#128038;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>`;
    },
    
}

export const verifyEmailTemplate = (data) => {
  return templates[data.subject](data)
};
