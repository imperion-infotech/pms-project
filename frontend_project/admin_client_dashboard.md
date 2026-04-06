# Property Management System (PMS) - Dashboard Architecture & Responsibilities

Yeh document PMS App ke **Admin Dashboard** aur **Client/User Dashboard** ke beech ke functionalities aur features ko step-by-step explain karta hai.

---

## 1. Admin Dashboard (Property Master Dashboard)
**Role:** `ROLE_ADMIN` ya `ROLE_MANAGER`

Admin Dashboard application ka "Control Center" hai. Yahan par property ka pura backend setup aur management kiya jata hai. Iska main kaam system configurations create karna aur poore staff/guest ka data globally manage karna hai.

**Admin Dashboard Ke Main Kaam (Step-by-Step):**

1. **Building & Floor Management:**
   - Property mein nayi buildings add karna (e.g., Wing A, Block B).
   - Un buildings ke andar floors configure karna (e.g., Ground Floor, 1st Floor).
   - In floors aur buildings ki listing ko edit ya delete karna.

2. **Room & Room Types Configuration:**
   - **Room Types:** Alag-alag room categories setup karna (jaise ki Standard, Premium, Suite) aur unke details define karna.
   - **Rooms Creation:** Floors ke hisab se naye rooms create karna aur unko Room Types aur current status assign karna.

3. **Room Status Management:**
   - System ke statuses define karna jo room ki real-time condition batate hain (e.g., *Vacant Ready*, *Occupied*, *Under Cleaning*, *Maintenance*), taaki client dashboard par status ka color aur label update ho sake.

4. **Tax & Financial Management:**
   - GST ya aur koi taxes setup karna jinke basis par guests ki rent, billing aur receipts manage hoti hain.
   - Taxes create, edit aur unko delete karna global system level pe.

5. **Global Guest & Personal Details Management:**
   - Saare guests ka master data dekhna, naya data insert karna ya update karna.
   - **Document Types & Documents:** Guest Verification Documents (like Aadhar Card, Passport) backend se manage karna.
   - Guest ki images (profile photo, room front/back image, signature) server par securely upload karna.
   - **Comprehensive Delete:** Guest ki entry delete karne par, cascade delete se automatically unka data, unke documents, unka stay details aur saari files automatically server par se clear ho jati hain.

6. **Pagination aur Global Search:**
   - Kisi bhi guest ya room detail ko global database me turant search karna (using intelligent search filters for names, emails, rooms).
   - Data list ko efficiently paginate karna.

---

## 2. Client Dashboard (User / Front-Desk HomeScreen)
**Role:** `ROLE_USER` ya Non-Admin Staff

Client Dashboard receptionist aur front-desk staff ke use ke liye design kiya gaya hai. Iska interface simple aur super-fast hota hai taaki operational check-ins aur daily kaam bina kisi delay ke fast ho sake.

**Client Dashboard Ke Main Kaam (Step-by-Step):**

1. **Live Visual Room Grid (Visual Display):**
   - Sabhi floors ka ek live visual map (graphical cards interface) show hota hai.
   - Rooms ko automatically floors ke blocks me arrange kiya hua dikhta hai, jise scroll kar ke aasani se check kar sakte hain.

2. **Real-time Occupancy & Quick Stats:**
   - "Kaun sa room khali hai aur kaun sa room book hai?" — iska visual alert (colors aur icons) live dikhta hai.
   - Page ke upar check kar sakte hain total statistics: *Total Occupied Rooms* aur *Total Available Rooms*.

3. **Fast Check-in / Check-out (Guest Action Modal):**
   - Agar staff ko kisi naye guest ko room dena hai, toh bas visual interface se ek *Vacant Ready* (khali) room par click karna hota hai.
   - Turant ek `GuestProfileModal` pop-up khulta hai. Yahan front-desk staff fast data-entry kar ke guest ka name, identity documents check-in attach kar ke room status live block kar sakta hai.

4. **Quick Context Menu (Right-Click Room Status Update):**
   - Rooms par right-click karne se ek 'Context Menu' on the spot khulta hai.
   - User direct wahin se room ka status badal sakta hai (jaise ek guest ne check out kiya toh usko turant direct *Under Cleaning* ya cleaning khatam hone pe *Vacant Ready* mark kar diya). Iske liye naye pages me jaane ki zaroorat nahi padti.

5. **Simplified Access (No settings clutter):**
   - System-level configuration (jaise naya floor add karna, tax manage karna, system status items banana) is dashboard mein **nahi** hote. Isse galti hone ka darr kam ho jata hai aur system secure rehta hai sirf real-time operations ke liye!

---

### Conclusion (Mota-Moti):
- **Admin Dashboard** ka maksad system ka **PROPERTY SETUP AUR CONFIGURATION** tayyar karna hai. 
- **Client Dashboard** ka maksad property staff ke liye **DAILY OPERATIONS AUR RECEPTION TICKETING (Check-in/Check-out)** ko bohot fast aur visual banana hai.
