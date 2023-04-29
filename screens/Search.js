import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Search() {
  return (
    <View style={styles.container}>
      <Text>Search coming soon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
container:{
  display:"flex",
  flexDirection:"column",
    flex:1,
    justifyContent: 'center',
   alignItems:"center" 
}})