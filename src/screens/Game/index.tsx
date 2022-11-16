import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList, Image, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";

import { Background } from "../../components/Background";
import { Heading } from "../../components/Heading";
import { DuoCard, DuoCardsProps } from "../../components/DuoCard";
import { DuoMatch } from "../../components/DuoMatch";

import logoImg from "../../../assets/Logo.png";

import { styles } from "./styles";
import { THEME } from "../../theme";

interface RouteParams {
  id: string;
  title: string;
  bannerUrl: string;
}

export function Game() {
  const [duos, setDuos] = useState<DuoCardsProps[]>([]);
  const [discordSelected, setDiscordSelected] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const game = route.params as RouteParams;

  function handleGoBack() {
    navigation.goBack();
  }

  async function getDiscordUser(adsId: string){
    fetch(`http://192.168.0.213:3333/ads/${adsId}/discord`)
      .then((response) => response.json())
      .then((data) => setDiscordSelected(data.discord));
  }

  useEffect(() => {
    fetch(`http://192.168.0.213:3333/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => setDuos(data));
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo} />

          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />

        <FlatList
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => getDiscordUser(item.id)} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[duos.length > 0 ? styles.contentList : { flex: 1, alignItems: 'center', justifyContent: 'center'}]}
          style={styles.containerList}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>
              Não há anúncios publicados para esse jogo
            </Text>
          )}
        />

        <DuoMatch 
          visible={discordSelected.length > 0}
          discord={discordSelected}
          onClose={()=> setDiscordSelected('')}
        />
      </SafeAreaView>
    </Background>
  );
}
