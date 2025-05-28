Bạn là một Senior React Native Engineer giàu kinh nghiệm, chịu trách nhiệm xây dựng toàn bộ ứng dụng THD Wiki Mobile (React Native) theo **Tài liệu Thiết kế Ứng dụng THD Wiki Mobile (React Native)** được đính kèm.  
Hãy thực hiện tuần tự các bước sau:

1. **Khởi tạo dự án**  
   - Dự án React Native mới, TypeScript.  
   - Thiết lập CI/CD với GitHub Actions (build, lint, test).

2. **Thiết lập môi trường và thư viện**  
   - Cài đặt các package: 
     - `react-native-paper` và/hoặc `tailwindcss-react-native` cho UI.  
     - `react-navigation` cho điều hướng.  
     - `react-native-encrypted-storage` để lưu token.  
     - `xmlrpc` hoặc tự viết client XML-RPC.  
     - `react-native-webview` hoặc `react-native-render-html` để hiển thị HTML.

3. **Xây dựng cấu trúc folder**  
   - `/src/screens`: Login, Home, PageList, PageDetail, Editor, Search, Settings.  
   - `/src/components`: Header, ListItem, MarkdownViewer, TextEditor, Sidebar.  
   - `/src/navigation`: DrawerNavigator, StackNavigator.  
   - `/src/api`: xmlRpcClient.ts, auth.ts, pageService.ts.  
   - `/src/store` (dùng Redux hoặc Context): authState, pageList, pageContent.

4. **Triển khai chức năng chính theo UC**  
   - **UC-1/UC-2 Đăng nhập/Đăng xuất**  
     - Form Login với “Ghi nhớ đăng nhập”.  
     - Gọi API `dokuwiki.login(username,password)` qua XML-RPC.  
     - Lưu token encrypted, hỗ trợ logout xóa token.  
   - **UC-3 Duyệt danh sách trang**  
     - Gọi `dokuwiki.getPagelist("", {})`, hiển thị FlatList.  
   - **UC-4 Lọc namespace**  
     - Dropdown namespace, gọi `getPagelist(namespace, {})`.  
   - **UC-5 Xem nội dung trang**  
     - Khi bấm vào PageList, gọi `wiki.getPageHTML(pagename)`.  
     - Hiển thị trong WebView hoặc component render HTML.  
   - **UC-6 Tạo trang mới**  
     - Form gồm tên trang, namespace, nội dung markdown.  
     - Kiểm tra tồn tại qua `getPage`, nếu chưa có gọi `putPage`.  
   - **UC-7 Chỉnh sửa trang**  
     - Lấy nội dung hiện tại, cho sửa, nhập summary (≤200 ký tự).  
     - Gọi `putPage` với summary.  
   - **UC-8 Tìm kiếm**  
     - Form search, gọi `wiki.search(keyword)`, hiển thị kết quả.  
   - **(Tuỳ chọn) UC-9 Quản lý media**  
     - Upload file (ảnh, PDF) qua XML-RPC nếu cần.

5. **Business Rules & Error Handling**  
   - Mọi request timeout ≤5s.  
   - Không cho trùng tiêu đề, summary ≤200 ký tự.  
   - Hiển thị popup/Toast khi lỗi (mạng, auth, XML-RPC).

6. **UI/UX & Style Guide**  
   - Dùng Material Design với React Native Paper.  
   - Layout responsive, tối ưu cho màn hình di động.  
   - Thêm Drawer Sidebar với các mục: Home, PageList, Search, Settings, Profile, Logout.

7. **Kiểm thử & QA**  
   - Viết unit tests (Jest + React Testing Library).  
   - Viết integration tests (Detox).  
   - CI chạy lint, test, build.

8. **DevOps & Triển khai**  
   - Cấu hình GitHub Actions build/test, Fastlane deploy beta.

**Yêu cầu kết quả**  
- Mỗi bước có code mẫu, giải thích rõ ràng.  
- Cuối cùng, kết quả là một repo React Native hoàn chỉnh, sẵn sàng build trên iOS và Android.


