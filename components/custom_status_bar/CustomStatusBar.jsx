import * as React from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';
import { styles } from './CustomStatusBarStyles';
import { useTheme } from 'customHooks/useTheme';
import { useSelector } from 'react-redux';
import { selectCurrentMode } from 'redux/theme/ThemeSlice';
import { selectCurrentManifold } from 'redux/manifold/ManifoldSlice';
import { app_dms } from 'globals/styles';

const CustomStatusBar = ({...props }) => {
  const { theme, themeMode } = useTheme();
  const hiddenStatusBar = useSelector(selectCurrentManifold).hiddenStatusBar

  return(
  <View style={{ backgroundColor: theme.background, height: hiddenStatusBar ? 0 : app_dms.statusBarHeight}}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={theme.background} barStyle = {themeMode === 'light' ? "dark-content" : "light-content"} {...props} />
    </SafeAreaView>
  </View>)
}

export default CustomStatusBar