<?php

namespace App\Http\Requests;

use App\Models\BannedWord;
use App\Models\ReportSetting;
use Illuminate\Contracts\Validation\Validator as ValidatorContract;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Otorisasi kepemilikan + status + setting report_allow_edit
        // dicek di ReportController@update lewat ReportPolicy-style check,
        // supaya pesan error bisa lebih spesifik daripada 403 form request generik.
        return true;
    }

    public function rules(): array
    {
        $maxCount = (int) ReportSetting::get('report_max_attachment_count', 5);
        $maxSizeKb = (int) ReportSetting::get('report_max_attachment_size_kb', 10240);
        $formats = ReportSetting::get('report_allowed_attachment_formats', 'jpg,jpeg,png,mp4,mov');

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
            'is_anonymous' => ['boolean'],
            // Lampiran baru yang ditambahkan saat edit
            'attachments' => ['nullable', 'array', "max:{$maxCount}"],
            'attachments.*' => ['file', "mimes:{$formats}", "max:{$maxSizeKb}"],
            // ID lampiran lama yang dihapus user saat edit
            'removed_attachment_ids' => ['nullable', 'array'],
            'removed_attachment_ids.*' => ['integer', 'exists:report_attachments,id'],
        ];
    }

    public function messages(): array
    {
        $maxCount = (int) ReportSetting::get('report_max_attachment_count', 5);
        $maxSizeMb = (int) round(((int) ReportSetting::get('report_max_attachment_size_kb', 10240)) / 1024);

        return [
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori tidak valid.',
            'title.required' => 'Judul aduan wajib diisi.',
            'description.required' => 'Isi aduan wajib diisi.',
            'description.min' => 'Isi aduan minimal 10 karakter.',
            'attachments.max' => "Maksimal {$maxCount} lampiran.",
            'attachments.*.mimes' => 'Format lampiran tidak didukung.',
            'attachments.*.max' => "Ukuran lampiran maksimal {$maxSizeMb}MB.",
        ];
    }

    public function withValidator(ValidatorContract $validator): void
    {
        $validator->after(function (ValidatorContract $validator) {
            $text = mb_strtolower($this->input('title') . ' ' . $this->input('description'));

            $bannedWords = BannedWord::where('is_active', true)->pluck('word');

            foreach ($bannedWords as $word) {
                if ($word !== '' && str_contains($text, mb_strtolower($word))) {
                    $validator->errors()->add(
                        'description',
                        'Aduan mengandung kata yang tidak diperbolehkan. Mohon gunakan bahasa yang sopan.'
                    );
                    break;
                }
            }
        });
    }
}