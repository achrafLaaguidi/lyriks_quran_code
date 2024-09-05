import { Select } from "antd";
import { t } from "i18next";

const paths = ['', 'radio', 'chapters', 'hadiths']
const languages = [
    {
        id: "1",
        native: "العربية",
        locale: "ar",
        font: "font-Arabic"
    },
    {
        id: "2",
        native: "English",
        locale: "eng",
        font: "font-Foreigner"
    },
    {
        id: "3",
        native: "Français",
        locale: "fr",
        font: "font-Foreigner"
    }

];


const SelectInput = ({ options, value, onChange, placeholder, className, showSearch }) => (
    <Select
        showSearch={showSearch}
        value={value}
        onChange={onChange}
        className={className + ` ${t('font')}`}
        placeholder={placeholder}
    >
        {options.map((option) => (
            <Select.Option key={option.locale || option.id} value={option.native || option.name} className={`${option.font || t('font')}`}>
                {option.native || option.name}
            </Select.Option>
        ))}
    </Select>
);

export { paths, SelectInput, languages }