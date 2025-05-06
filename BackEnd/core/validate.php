<?php
function validateString($key, $value, $maxLength = 255) {
    if (!isset($value) || !is_string($value) || trim($value) === '' || strlen($value) > $maxLength) {
        throw new Exception("Érvénytelen vagy hiányzó mező: $key");
    }
}

function validateArray($key, $value) {
    if (!isset($value) || !is_array($value)) {
        throw new Exception("Érvénytelen vagy hiányzó mező: $key");
    }
}
