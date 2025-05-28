export type DrawerParamList = {
    Home: undefined;
    Search: undefined;
    CreatePage: undefined;
    Settings: undefined;
};

export type RootStackParamList = {
    Login: undefined;
    MainDrawer: undefined;
    ViewPage: { pageId: string };
    EditPage: { pageId: string; isNew?: boolean }; 
    Search: undefined;
}