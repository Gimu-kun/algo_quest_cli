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
        padding: 10,
      },
      image: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        borderRadius: 10,
        overflow:'hidden'
      },
      markBox:{
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width:'100%',
        height: 'auto',
      },
      courseRole:{
        display: 'flex',
        backgroundColor: '#eeeeee',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        width: 80,
        padding: 5
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
        paddingVertical: 2,
        paddingHorizontal: 5
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
        columnGap: 5
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
      }
})

export default styles;