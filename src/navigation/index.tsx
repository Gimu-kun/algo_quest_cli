import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderButton, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import bell from '../assets/bell.png';
import newspaper from '../assets/newspaper.png';
import { LandingPage } from './screens/LandingPage/LandingPage';
import { Login } from './screens/Login/Login';
import { Register } from './screens/Register/Register';
import { Home } from './screens/Home/Home';
import { Roadmap } from './screens/Roadmap/Roadmap';
import QuestionRenderer from '../components/questionRenderer/QuestionRenderer';
import { SinglePlay } from './screens/SinglePlay/SinglePlay';
import WaitingRoom from './screens/WaitingRoom/WaitingRoom';

// 1. Chỉ chứa các màn hình cần Tab Bar (Ví dụ: Home, Roadmap nếu bạn muốn Tab ở dưới)
const HomeTabs = createBottomTabNavigator({
  screens: {
    // Chỉ giữ Home trong Tab Navigator
    Home: {
      screen: Home,
      options: {
        title: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    // 2. Đặt LandingPage làm màn hình đầu tiên và không có header
    LandingPage: {
      screen: LandingPage,
      options: {
        title: 'LandingPage',
        headerShown: false,
      },
    },
    // 3. Đặt Login và Register trực tiếp trong RootStack, không có Tab Bar
    Login: {
      screen: Login,
      options: {
        title: 'Login',
        headerShown: false,
      },
    },
    Register: {
      screen: Register,
      options: {
        title: 'Register',
        headerShown: false,
      },
    },
    QuestionRenderer: {
      screen: QuestionRenderer,
      options: {
        title: 'QuestionRenderer',
        headerShown: false,
      },
    },
    // 4. Màn hình chứa Tab Navigator (chỉ Home và các màn hình khác cần Tab mới nằm trong đây)
    HomeTabs: {
      screen: HomeTabs,
      options: {
        headerShown: false, // Ẩn Stack Header cho HomeTabs, chỉ hiển thị Tab Bar
      },
    },
    Roadmap: {
       screen: Roadmap,
       options: {
         title: 'Roadmap',
         headerShown: false,
       },
     },
    SinglePlay: {
       screen: SinglePlay,
       options: {
         title: 'SinglePlay',
         headerShown: false,
       },
     },
     WaitingRoom: {
       screen: WaitingRoom,
       options: {
         title: 'WaitingRoom',
         headerShown: false,
       },
     }
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}