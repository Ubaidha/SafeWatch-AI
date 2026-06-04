import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import { Image, ImageBackground, Text, View } from "react-native";
export default function _layout() {
    const TabIcon = (props:any) => {
        if (props.focused){

        return(
             <ImageBackground source={images.highlight} style={{ flexDirection: 'row', width: '100%', flex: 1, minWidth: 80, minHeight: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 9999, overflow: 'hidden' }}>
                        <Image source={props.icon} style={{width:15,height:15,tintColor:"#151312" }} />
                        <Text style={{ color: '#2e2e37ff', fontSize: 13, fontWeight: '600', marginLeft: 8 , }}>{props.text}</Text>
            </ImageBackground>
        )
    }
    return (
        <View>
            <Image source={props.icon} style={{width:15,height:15,tintColor:"#6B7280" }} />
        </View>
    )
    }

    return (
        <Tabs screenOptions={{
            tabBarShowLabel:false,
            tabBarItemStyle:{
                width:"100%",
                height:"100%",
                justifyContent:"center",
                alignItems:"center",
                paddingVertical:5,
            },
            tabBarStyle:{
                backgroundColor:"#0f0D23",
                borderRadius:50,
                marginHorizontal:15,
                marginBottom:50,
                paddingBottom:5,
                height:45,
                position:"absolute",
                overflow:"hidden",
                borderWidth:1,
                borderColor:"#0f0d23",
                paddingHorizontal:8,

            }

        }}>
            <Tabs.Screen name="index" options={{ title: "Home", headerShown:false , tabBarIcon:({focused}) => (
                <TabIcon icon={icons.home} text="Home" focused={focused}/>
            ) }} />
            <Tabs.Screen name="cctv" options={{ title: "Cctv" ,headerShown:false , tabBarIcon:({focused}) => (
                <TabIcon icon={icons.cam} text="Cctv" focused={focused}/>
            ) }} />
            <Tabs.Screen name="alerts" options={{ title: "Alerts" , headerShown:false ,  tabBarIcon:({focused}) => (
                <TabIcon icon={icons.bell} text="Alerts" focused={focused}/>
            )}}/>
            <Tabs.Screen name="profile" options={{ title: "Profile" ,headerShown:false ,  tabBarIcon:({focused}) => (
                <TabIcon icon={icons.person} text="Profile" focused={focused}/>
            ) }} />
        </Tabs>    );
}   
