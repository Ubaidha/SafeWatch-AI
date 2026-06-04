import { icons } from '@/constants/icons';
import React from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
interface Props {
    placeholder: string;
    onPress: () => void;
}
const SearchBar = ({placeholder ,onPress} : Props) => {
  return (
    <View style={{flexDirection:'row', alignItems:'center',  paddingHorizontal:20, paddingVertical:8, borderRadius:8 }}>
      <Image source={icons.search} style={{height:15, width:15 , tintColor:'#ab8bff'}}/> 
      <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{width:'100%'}}
      >  
      <TextInput
        placeholder={placeholder}
        value=''
        onChangeText={()=>{}}
        placeholderTextColor='#a8b5db'
        style={{flex:1, marginLeft:13 , color:'white' , borderRadius:999,paddingLeft:6, marginRight:0}}
      />
      </TouchableOpacity> 
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({})