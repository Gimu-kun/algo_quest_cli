import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        paddingVertical: 20
      },
      header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 35,
        paddingVertical: 15,
      },
      headerTitle:{
        fontSize: 22,
        fontWeight: "bold",
      },
      seeAll:{
        fontSize: 14,
        color: '#00aaffff',
        textDecorationLine: 'underline'
      },
      card: {
        display:'flex',
        gap: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 5,
        marginHorizontal: 15,
      },
      image: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        borderRadius: 10,
        overflow:'hidden'
      },
      courseRole:{
        display: 'flex',
        backgroundColor: '#eeeeee',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        width: 80,
        padding: 10
      },
      courseRoleTxt:{
        fontSize:11
      },
      courseRank:{
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 50,
        borderColor:'red',
        paddingVertical: 10,
        paddingHorizontal: 10
      },
      courseRankTxt:{
        fontSize:11,
        color: 'red',
      },
      title: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "600",
      },
      subTitle: {
        fontSize: 14,
        color: "#888",
        marginTop: 4,
      },
      navigateBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#f20717',
        borderRadius: 10,
        columnGap: 5,
        margin:10
      },
      navigateBtnTxt:{
        fontSize:18,
        color:'#e0e0e0'
      },
      btnHolder:{
        position: 'absolute',
        top: -70,
        right: 40,
        width: 100,
        height: 100,
        zIndex: 5,
        pointerEvents: 'none'
      },
      markBox:{
        display:'flex',
        position:'absolute',
        top: 0,
        left: 0,
        backgroundColor:'#00000088', // Màu đen trong suốt
        justifyContent:'center',
        alignItems:'center',
        padding: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
      },
      
      // Style cho chữ bên trong markBox
      markTxt:{
          fontSize:14,
          fontWeight: "bold",
          color: '#fff',
        },

      // Style cho hộp chứa tất cả thông tin dưới ảnh (bao gồm title, info, buttons)
      infoBox: {
          display: 'flex',
          gap: 10,
          paddingHorizontal: 5
      },

      // Style cho hàng chứa vai trò (courseRole) và xếp hạng (courseRank)
      titleInfo:{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width:'100%',
          height: 'auto',
        },
})

export default styles;