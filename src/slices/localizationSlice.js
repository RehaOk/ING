import {createSlice} from '@reduxjs/toolkit';
import en from '../localization/en.json' with { type: 'json' };
import tr from '../localization/tr.json' with { type: 'json' };

const languages = {en, tr};

const localizationSlice = createSlice({
  name: 'localization',
  initialState: {
    locale: 'en',
    translations: languages['en'],
  },
  reducers: {
    setLocale(state, action) {
      const locale = action.payload;
      if (languages[locale]) {
        state.locale = locale;
        state.translations = languages[locale];
      }
    },
  },
});

export const {setLocale} = localizationSlice.actions;
export default localizationSlice.reducer;
