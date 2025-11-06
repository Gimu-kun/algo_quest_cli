import { StyleSheet } from "react-native";

export const styles = StyleSheet.create(
    {
        container: {
            width: '90%',
            height: 250, // Chiều cao cố định cho khung
            alignSelf: 'center', // Căn giữa theo chiều ngang
            marginTop: 20, // Khoảng cách với component bên trên
            borderRadius: 16,

            // Thêm hiệu ứng bóng đổ cho đẹp mắt
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            backgroundColor: '#fff', // Màu nền cho bóng đổ (trên iOS)
        },

        // 2. Tấm ảnh nền
        imageBackground: {
            flex: 1, // Chiếm toàn bộ không gian của 'container'
            justifyContent: 'flex-end', // Đẩy nội dung (các nút) xuống dưới
            alignItems: 'center', // Căn giữa nội dung (các nút) theo chiều ngang
        },
        imageStyle: {
            borderRadius: 16, // Bo tròn góc cho tấm ảnh
        },

        // 3. Container cho 2 cái nút
        buttonContainer: {
            flexDirection: 'row', // Sắp xếp 2 nút nằm ngang
            justifyContent: 'space-evenly', // Căn đều 2 nút
            width: '100%', // Chiếm toàn bộ chiều rộng
            marginBottom: 20, // Khoảng cách từ đáy ảnh lên
        },

        // 4. Style cho từng nút
        button: {
            flexDirection: 'row', // Icon và chữ nằm ngang
            alignItems: 'center', // Căn giữa icon và chữ
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // Màu trắng hơi mờ
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderRadius: 30, // Bo tròn (hình viên thuốc)
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },

        // 5. Style cho chữ trong nút
        buttonText: {
            color: '#0369A1', // (Màu xanh đậm)
            fontWeight: 'bold',
            fontSize: 16,
            marginLeft: 8, // Khoảng cách giữa icon và chữ
        },
    }
)